const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const TRIAL_LIMIT = 5;
const EARLY_BIRD_PRICE = 19.99;
const NORMAL_PRICE = 29.99;
const VALID_SUBJECTS = ['MATH', 'ADD_MATH', 'SCIENCE', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY', 'ADD_SCIENCE'];

// ============================================================
// REGISTER STUDENT
// Student picks 1 subject → TRIAL immediately → 5 free messages
// WhatsApp to parent fires ONLY when student clicks approval button
// ============================================================

const registerStudent = async (req, res) => {
  const {
    studentName,
    studentEmail,
    studentMobile,
    studentAge,
    studentPassword,
    parentName,
    parentWhatsapp,
    parentRelationship,
    inviteCode,
    subject
  } = req.body;

  try {
    if (!subject) {
      return res.status(400).json({ error: 'Please select a subject to subscribe.' });
    }

    if (!VALID_SUBJECTS.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject selected.' });
    }

    const existingStudent = await prisma.student.findUnique({
      where: { mobile: studentMobile }
    });
    if (existingStudent) {
      return res.status(400).json({ error: 'Mobile number already registered.' });
    }

    let parent = await prisma.parent.findUnique({
      where: { whatsapp: parentWhatsapp }
    });

    if (!parent) {
      parent = await prisma.parent.create({
        data: {
          name: parentName,
          whatsapp: parentWhatsapp,
          relationship: parentRelationship || 'FATHER'
        }
      });
    }

    let referrerStudent = null;
    if (inviteCode) {
      referrerStudent = await prisma.student.findUnique({
        where: { referralCode: inviteCode }
      });
      if (!referrerStudent) {
        return res.status(400).json({ error: 'Invalid invite code.' });
      }
    }

    const passwordHash = await bcrypt.hash(studentPassword, 10);
    const referralCode = uuidv4().split('-')[0].toUpperCase();
    const parentApprovalToken = uuidv4();
    const parentTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const totalStudents = await prisma.student.count();
    const isFirstAdopter = totalStudents < 10000;
    const price = isFirstAdopter ? EARLY_BIRD_PRICE : NORMAL_PRICE;
    const priceType = isFirstAdopter ? 'EARLY_BIRD' : 'NORMAL';

    const student = await prisma.student.create({
      data: {
        name: studentName,
        email: studentEmail || null,
        mobile: studentMobile,
        age: studentAge ? parseInt(studentAge) : null,
        passwordHash,
        parentId: parent.id,
        referralCode,
        inviteCode: inviteCode || null,
        parentApprovalToken,
        parentTokenExpiry,
        isFirstAdopter,
        status: 'TRIAL',
        trialMessages: 0
      }
    });

    const paymentLink = `${process.env.FRONTEND_URL}/parent/approve?token=${parentApprovalToken}&subject=${subject}&price=${price}&priceType=${priceType}`;

    await prisma.studentApprovalLog.create({
      data: {
        studentId: student.id,
        action: 'TRIAL_STARTED',
        triggeredBy: 'SYSTEM',
        note: `Parent: ${parentWhatsapp} | Subject: ${subject} | Price: RM${price} | PriceType: ${priceType} | PaymentLink: ${paymentLink}`
      }
    });

    return res.status(201).json({
      message: 'Registration successful. You have 5 free messages with Zed!',
      studentId: student.id,
      referralCode: student.referralCode,
      trialMessages: 0,
      trialLimit: TRIAL_LIMIT,
      subject,
      price,
      priceType
    });

  } catch (error) {
    console.error('registerStudent error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ============================================================
// LOGIN STUDENT
// TRIAL + ACTIVE can login
// PENDING + SUSPENDED + EXPIRED are blocked
// ============================================================

const loginStudent = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { mobile },
      include: {
        subjectAccess: true,
        subscriptions: {
          where: { isActive: true },
          select: { subject: true, priceType: true, price: true, endDate: true }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    if (student.status === 'PENDING') {
      return res.status(403).json({ error: 'Account pending parent approval and payment.' });
    }

    if (student.status === 'SUSPENDED') {
      return res.status(403).json({ error: 'Account suspended. Contact support.' });
    }

    if (student.status === 'EXPIRED') {
      return res.status(403).json({ error: 'Subscription expired. Please renew.' });
    }

    const isValid = await bcrypt.compare(password, student.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // TRIAL gets access to all 7 subjects for 5 messages
    // ACTIVE gets only subscribed subjects
    const subjects = student.status === 'TRIAL'
      ? VALID_SUBJECTS
      : student.subjectAccess.map(s => s.subject);

    const token = jwt.sign(
      {
        studentId: student.id,
        name: student.name,
        status: student.status,
        subjects
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
      student: {
        id: student.id,
        name: student.name,
        mobile: student.mobile,
        status: student.status,
        referralCode: student.referralCode,
        isFirstAdopter: student.isFirstAdopter,
        trialMessages: student.trialMessages,
        trialLimit: TRIAL_LIMIT,
        subjects,
        subscriptions: student.subscriptions
      }
    });

  } catch (error) {
    console.error('loginStudent error:', error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ============================================================
// REQUEST PARENT APPROVAL
// Student clicks button → WhatsApp fires → status PENDING
// ============================================================

const requestParentApproval = async (req, res) => {
  const studentId = req.student.studentId;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    if (student.status !== 'TRIAL') {
      return res.status(400).json({ error: 'Only TRIAL accounts can request approval.' });
    }

    const log = await prisma.studentApprovalLog.findFirst({
      where: { studentId, action: 'TRIAL_STARTED' },
      orderBy: { createdAt: 'desc' }
    });

    if (!log?.note) {
      return res.status(400).json({ error: 'Registration details not found.' });
    }

    const parentMatch = log.note.match(/Parent: ([^\s|]+)/);
    const subjectMatch = log.note.match(/Subject: ([^\s|]+)/);
    const priceMatch = log.note.match(/Price: RM([^\s|]+)/);
    const linkMatch = log.note.match(/PaymentLink: (.+)$/);

    if (!parentMatch || !linkMatch) {
      return res.status(400).json({ error: 'Parent details incomplete.' });
    }

    const subjectLabel = subjectMatch ? subjectMatch[1] : 'subject pilihan';
    const price = priceMatch ? priceMatch[1] : '19.99';

    await sendWhatsApp(
      parentMatch[1],
      `Salam 👋\n\nAnak anda *${student.name}* telah mencuba *ZED* — AI Tutor SPM!\n\n📚 Subject: *${subjectLabel}*\n💰 Harga Early Bird: *RM${price}/bulan*\n\n🎯 Anak anda dah rasa sendiri macam mana Zed mengajar. Kalau bagus, teruskan!\n\n✅ Klik link di bawah untuk aktifkan akaun:\n\n${linkMatch[1]}\n\n_ZED — Zero Educational Divide_`
    );

    await prisma.student.update({
      where: { id: studentId },
      data: { status: 'PENDING' }
    });

    await prisma.studentApprovalLog.create({
      data: {
        studentId,
        action: 'APPROVAL_REQUESTED',
        triggeredBy: 'STUDENT',
        note: `WhatsApp sent to ${parentMatch[1]} for subject ${subjectLabel} at RM${price}`
      }
    });

    return res.status(200).json({
      message: 'WhatsApp sent to parent. Please wait for approval.'
    });

  } catch (error) {
    console.error('requestParentApproval error:', error);
    return res.status(500).json({ error: 'Failed to send approval request.' });
  }
};

// ============================================================
// ADD SUBJECT
// Active student adds another subject → creates new SubjectSubscription
// Fires new payment link to parent
// ============================================================

const addSubject = async (req, res) => {
  const studentId = req.student.studentId;
  const { subject } = req.body;

  try {
    if (!VALID_SUBJECTS.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject.' });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: true,
        subjectAccess: true,
        subscriptions: true
      }
    });

    if (!student) return res.status(404).json({ error: 'Student not found.' });
    if (student.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Only active students can add subjects.' });
    }

    const alreadySubscribed = student.subscriptions.find(s => s.subject === subject && s.isActive);
    if (alreadySubscribed) {
      return res.status(400).json({ error: `Already subscribed to ${subject}.` });
    }

    const price = student.isFirstAdopter ? EARLY_BIRD_PRICE : NORMAL_PRICE;
    const priceType = student.isFirstAdopter ? 'EARLY_BIRD' : 'NORMAL';

    const paymentLink = `${process.env.FRONTEND_URL}/parent/add-subject?studentId=${studentId}&subject=${subject}&price=${price}&priceType=${priceType}`;

    await sendWhatsApp(
      student.parent.whatsapp,
      `Salam 👋\n\nAnak anda *${student.name}* ingin tambah subject baru di *ZED*!\n\n📚 Subject Baru: *${subject}*\n💰 Harga: *RM${price}/bulan*\n\n✅ Klik link untuk bayar dan aktifkan:\n\n${paymentLink}\n\n_ZED — Zero Educational Divide_`
    );

    return res.status(200).json({
      message: `Payment link sent to parent for ${subject}.`,
      subject,
      price,
      priceType
    });

  } catch (error) {
    console.error('addSubject error:', error);
    return res.status(500).json({ error: 'Failed to add subject.' });
  }
};

// ============================================================
// HELPER — Send WhatsApp via UltraMsg
// ============================================================

const sendWhatsApp = async (to, message) => {
  try {
    await axios.post(
      `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`,
      {
        token: process.env.ULTRAMSG_TOKEN,
        to: `60${to}`,
        body: message
      }
    );
  } catch (err) {
    console.error('UltraMsg error:', err.message);
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  sendWhatsApp,
  requestParentApproval,
  addSubject
};