const prisma = require('../lib/prisma');
const axios = require('axios');

const EARLY_BIRD_PRICE = 19.99;
const NORMAL_PRICE = 29.99;
const REFERRAL_CREDIT_PER_SUBJECT = 5.00;

// ============================================================
// CREATE BILL
// Parent opens WhatsApp link → validates token → creates Billplz bill
// One bill per subject
// ============================================================

const createBill = async (req, res) => {
  const { token, subject, priceType } = req.body;

  try {
    if (!token || !subject || !priceType) {
      return res.status(400).json({ error: 'Token, subject and priceType are required.' });
    }

    const validSubjects = ['MATH', 'ADD_MATH', 'SCIENCE', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'ADD_SCIENCE'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject.' });
    }

    const student = await prisma.student.findUnique({
      where: { parentApprovalToken: token },
      include: { parent: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Invalid or expired approval link.' });
    }

    if (new Date() > student.parentTokenExpiry) {
      return res.status(400).json({ error: 'Approval link expired. Ask your child to register again.' });
    }

    if (student.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Student is already active.' });
    }

    const price = priceType === 'EARLY_BIRD' ? EARLY_BIRD_PRICE : NORMAL_PRICE;
    const parent = student.parent;

    const billplzResponse = await axios.post(
      'https://www.billplz-sandbox.com/api/v3/bills',
      {
        collection_id: process.env.BILLPLZ_COLLECTION_ID,
        description: `ZED — ${subject} for ${student.name} (${priceType === 'EARLY_BIRD' ? 'Early Bird' : 'Normal'})`,
        email: parent.email || 'noreply@zed.my',
        name: parent.name,
        amount: Math.round(price * 100),
        callback_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
        redirect_url: `${process.env.FRONTEND_URL}/parent/payment-success`,
        reference_1_label: 'Student ID',
        reference_1: student.id,
        reference_2_label: 'Subject',
        reference_2: subject,
        reference_3_label: 'PriceType',
        reference_3: priceType
      },
      {
        auth: {
          username: process.env.BILLPLZ_API_KEY,
          password: ''
        }
      }
    );

    const bill = billplzResponse.data;

    const subscription = await prisma.subjectSubscription.create({
      data: {
        studentId: student.id,
        subject,
        priceType,
        price,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: false
      }
    });

    await prisma.payment.create({
      data: {
        parentId: parent.id,
        subscriptionId: subscription.id,
        amount: price,
        method: 'BILLPLZ',
        status: 'PENDING',
        billplzBillId: bill.id,
        billplzUrl: bill.url
      }
    });

    return res.status(200).json({
      message: 'Bill created successfully.',
      paymentUrl: bill.url,
      studentName: student.name,
      subject,
      price,
      priceType
    });

  } catch (error) {
    console.error('createBill error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create payment bill.' });
  }
};

// ============================================================
// BILLPLZ WEBHOOK
// Parent pays → activate subject → seed access → referral RM5
// ============================================================

const billplzWebhook = async (req, res) => {
  try {
    const {
      id: billId,
      paid,
      paid_at,
      reference_1: studentId,
      reference_2: subject,
      reference_3: priceType
    } = req.body;

    if (paid !== 'true') {
      return res.status(200).json({ message: 'Payment not successful. Ignored.' });
    }

    const payment = await prisma.payment.findFirst({
      where: { billplzBillId: billId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    if (payment.status === 'SUCCESS') {
      return res.status(200).json({ message: 'Already processed.' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    await prisma.$transaction(async (tx) => {

      // Update payment
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS', paidAt: new Date(paid_at) }
      });

      // Activate subject subscription
      await tx.subjectSubscription.update({
        where: { id: payment.subscriptionId },
        data: { isActive: true }
      });

      // Grant subject access
      await tx.studentSubjectAccess.upsert({
        where: { studentId_subject: { studentId, subject } },
        update: {},
        create: { studentId, subject }
      });

      // Seed subject progress
      await tx.studentSubjectProgress.upsert({
        where: { studentId_subject: { studentId, subject } },
        update: {},
        create: {
          studentId,
          subject,
          weakTopics: [],
          masteredTopics: []
        }
      });

      // Activate student if first subject payment
      await tx.student.update({
        where: { id: studentId },
        data: {
          status: 'ACTIVE',
          parentApprovedAt: new Date(paid_at),
          parentApprovalToken: null,
          parentTokenExpiry: null
        }
      });

      // Create ZedCredit wallet if not exists
      await tx.zedCredit.upsert({
        where: { studentId },
        update: {},
        create: {
          studentId,
          balance: 0,
          fundBalance: 0,
          escrowLocked: true
        }
      });

      // Log
      await tx.studentApprovalLog.create({
        data: {
          studentId,
          action: 'PARENT_PAID',
          triggeredBy: 'BILLPLZ_WEBHOOK',
          note: `Bill ID: ${billId} | Subject: ${subject} | PriceType: ${priceType}`
        }
      });

      // Referral — RM5 per subject
      if (student.inviteCode) {
        const referrer = await tx.student.findUnique({
          where: { referralCode: student.inviteCode }
        });

        if (referrer && referrer.status === 'ACTIVE') {

          // Avoid duplicate referral for same subject
          const existingReferral = await tx.referral.findUnique({
            where: {
              referrerStudentId_referredStudentId_subject: {
                referrerStudentId: referrer.id,
                referredStudentId: studentId,
                subject
              }
            }
          });

          if (!existingReferral) {
            const referral = await tx.referral.create({
              data: {
                referrerStudentId: referrer.id,
                referredStudentId: studentId,
                subject,
                creditAmount: REFERRAL_CREDIT_PER_SUBJECT,
                recurring: true,
                status: 'ACTIVE'
              }
            });

            // Ensure referrer wallet exists
            await tx.zedCredit.upsert({
              where: { studentId: referrer.id },
              update: {},
              create: {
                studentId: referrer.id,
                balance: 0,
                fundBalance: 0,
                escrowLocked: true
              }
            });

            const referrerWallet = await tx.zedCredit.findUnique({
              where: { studentId: referrer.id }
            });

            await tx.zedCredit.update({
              where: { studentId: referrer.id },
              data: { balance: { increment: REFERRAL_CREDIT_PER_SUBJECT } }
            });

            await tx.zedCreditTransaction.create({
              data: {
                creditId: referrerWallet.id,
                studentId: referrer.id,
                amount: REFERRAL_CREDIT_PER_SUBJECT,
                type: 'EARNED_REFERRAL',
                referralId: referral.id,
                note: `RM5 referral — ${student.name} subscribed ${subject}`
              }
            });
          }
        }
      }
    });

    return res.status(200).json({ message: 'Student activated successfully.' });

  } catch (error) {
    console.error('billplzWebhook error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
};

module.exports = { createBill, billplzWebhook };