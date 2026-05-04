const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const TRIAL_LIMIT = 5;

// ============================================================
// REGISTER STUDENT
// Student registers → TRIAL immediately → can chat 5 messages
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
    tier
  } = req.body;

  try {
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

    const paymentLink = `${process.env.FRONTEND_URL}/parent/approve?token=${parentApprovalToken}&tier=${tier}`;

    await prisma.studentApprovalLog.create({
      data: {
        studentId: student.id,
        action: 'TRIAL_STARTED',
        triggeredBy: 'SYSTEM',
        note: `Parent: ${parentWhatsapp} | Tier: ${tier} | PaymentLink: ${paymentLink}`
      }
    });

    return res.status(201).json({
      message: 'Registration successful. You have 5 free messages with Zed!',
      studentId: student.id,
      referralCode: student.referralCode,
      trialMessages: 0,
      trialLimit: TRIAL_LIMIT
    });

  } catch (error) {
    console.error('registerStudent error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ============================================================
// LOGIN STUDENT
// TRIAL + ACTIVE students can login
// PENDING + SUSPENDED + EXPIRED are blocked
// ============================================================

const loginStudent = async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { mobile },
      include: { subjectAccess: true }
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

    const subjects = student.status === 'TRIAL'
      ? ['BM', 'ENGLISH', 'MATH', 'SCIENCE', 'SEJARAH']
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
        subjects
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
      return res.status(400).json({ error: 'Parent details not found.' });
    }

    const parentMatch = log.note.match(/Parent: ([^\s|]+)/);
    const linkMatch = log.note.match(/PaymentLink: (.+)$/);

    if (!parentMatch || !linkMatch) {
      return res.status(400).json({ error: 'Parent details incomplete.' });
    }

    await sendWhatsApp(
      parentMatch[1],
      `Salam 👋\n\nAnak anda *${student.name}* telah mencuba *ZED* — AI Tutor SPM dan ingin teruskan pembelajaran!\n\n🎯 Anak anda dah rasa sendiri macam mana Zed mengajar!\n\n✅ Klik link di bawah untuk aktifkan akaun penuh:\n\n${linkMatch[1]}\n\n_ZED — Zero Educational Divide_`
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
        note: `Student requested parent approval. WhatsApp sent to ${parentMatch[1]}`
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

module.exports = { registerStudent, loginStudent, sendWhatsApp, requestParentApproval };