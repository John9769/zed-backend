const prisma = require('../lib/prisma');
const axios = require('axios');

// ============================================================
// SUBJECT SEEDS PER TIER
// ============================================================

const TIER_SUBJECTS = {
  THREE_SUBJECTS: ['BM', 'ENGLISH', 'MATH'],
  FIVE_SUBJECTS: ['BM', 'ENGLISH', 'MATH', 'SCIENCE', 'SEJARAH']
};

const TIER_PRICE = {
  THREE_SUBJECTS: 79.99,
  FIVE_SUBJECTS: 99.00
};

const REFERRAL_CREDIT = {
  THREE_SUBJECTS: 5.00,
  FIVE_SUBJECTS: 10.00
};

// ============================================================
// CREATE BILL
// Called when parent opens WhatsApp link
// Validates token → creates Billplz bill → returns payment URL
// ============================================================

const createBill = async (req, res) => {
  const { token, tier } = req.body;

  try {
    // 1. Validate token
    if (!token || !tier) {
      return res.status(400).json({ error: 'Token and tier are required.' });
    }

    // 2. Find student by approval token
    const student = await prisma.student.findUnique({
      where: { parentApprovalToken: token },
      include: { parent: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Invalid or expired approval link.' });
    }

    // 3. Check token expiry
    if (new Date() > student.parentTokenExpiry) {
      return res.status(400).json({ error: 'Approval link has expired. Ask your child to register again.' });
    }

    // 4. Check student not already active
    if (student.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Student is already active.' });
    }

    // 5. Validate tier
    if (!TIER_SUBJECTS[tier]) {
      return res.status(400).json({ error: 'Invalid subscription tier.' });
    }

    const price = TIER_PRICE[tier];
    const parent = student.parent;

    // 6. Create Billplz bill
    const billplzResponse = await axios.post(
      'https://www.billplz-sandbox.com/api/v3/bills',
      {
        collection_id: process.env.BILLPLZ_COLLECTION_ID,
        description: `ZED Subscription - ${tier === 'THREE_SUBJECTS' ? '3 Core Subjects' : '5 Subjects'} for ${student.name}`,
        email: parent.email || 'noreply@zed.my',
        name: parent.name,
        amount: Math.round(price * 100), // Billplz uses cents
        callback_url: `${process.env.BACKEND_URL}/api/payment/webhook`,
        redirect_url: `${process.env.FRONTEND_URL}/parent/payment-success`,
        reference_1_label: 'Student ID',
        reference_1: student.id,
        reference_2_label: 'Tier',
        reference_2: tier
      },
      {
        auth: {
          username: process.env.BILLPLZ_API_KEY,
          password: ''
        }
      }
    );

    const bill = billplzResponse.data;

    // 7. Create pending subscription + payment record
    const subscription = await prisma.subscription.create({
      data: {
        tier,
        price,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        studentId: student.id,
        isActive: false // not active until payment confirmed
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
      tier,
      price
    });

  } catch (error) {
    console.error('createBill error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create payment bill.' });
  }
};

// ============================================================
// BILLPLZ WEBHOOK
// Fires when parent pays
// Activates student → seeds subjects → creates wallet → referral
// ============================================================

const billplzWebhook = async (req, res) => {
  try {
    const {
      id: billId,
      paid,
      paid_at,
      reference_1: studentId,
      reference_2: tier
    } = req.body;

    // 1. Only process successful payments
    if (paid !== 'true') {
      return res.status(200).json({ message: 'Payment not successful. Ignored.' });
    }

    // 2. Find payment record
    const payment = await prisma.payment.findFirst({
      where: { billplzBillId: billId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    // 3. Avoid duplicate processing
    if (payment.status === 'SUCCESS') {
      return res.status(200).json({ message: 'Already processed.' });
    }

    // 4. Find student
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    // 5. Run everything in a transaction
    await prisma.$transaction(async (tx) => {

      // Update payment to SUCCESS
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          paidAt: new Date(paid_at)
        }
      });

      // Activate subscription
      await tx.subscription.update({
        where: { id: payment.subscriptionId },
        data: { isActive: true }
      });

      // Activate student
      await tx.student.update({
        where: { id: studentId },
        data: {
          status: 'ACTIVE',
          parentApprovedAt: new Date(paid_at),
          parentApprovalToken: null,  // invalidate token
          parentTokenExpiry: null
        }
      });

      // Seed subject access based on tier
      const subjects = TIER_SUBJECTS[tier] || TIER_SUBJECTS['THREE_SUBJECTS'];
      await tx.studentSubjectAccess.createMany({
        data: subjects.map(subject => ({
          studentId,
          subject
        })),
        skipDuplicates: true
      });

      // Seed subject progress records
      await tx.studentSubjectProgress.createMany({
        data: subjects.map(subject => ({
          studentId,
          subject,
          weakTopics: [],
          masteredTopics: []
        })),
        skipDuplicates: true
      });

      // Create ZedCredit wallet
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

      // Log approval
      await tx.studentApprovalLog.create({
        data: {
          studentId,
          action: 'PARENT_PAID',
          triggeredBy: 'BILLPLZ_WEBHOOK',
          note: `Bill ID: ${billId} | Tier: ${tier}`
        }
      });

      // Handle referral — if student used an invite code
      if (student.inviteCode) {
        const referrer = await tx.student.findUnique({
          where: { referralCode: student.inviteCode },
          include: { subscription: true }
        });

        if (referrer && referrer.status === 'ACTIVE') {
          const creditAmount = REFERRAL_CREDIT[tier] || 5.00;

          // Create referral record
          const referral = await tx.referral.create({
            data: {
              referrerStudentId: referrer.id,
              referredStudentId: studentId,
              creditAmount,
              recurring: true,
              status: 'ACTIVE'
            }
          });

          // Credit referrer wallet
          await tx.zedCredit.update({
            where: { studentId: referrer.id },
            data: {
              balance: { increment: creditAmount }
            }
          });

          // Log transaction
          await tx.zedCreditTransaction.create({
            data: {
              creditId: (await tx.zedCredit.findUnique({ where: { studentId: referrer.id } })).id,
              studentId: referrer.id,
              amount: creditAmount,
              type: 'EARNED_REFERRAL',
              referralId: referral.id,
              note: `Referral credit from ${student.name} joining`
            }
          });
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