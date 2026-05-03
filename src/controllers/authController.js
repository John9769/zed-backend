const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const TRIAL_LIMIT = 5;

// ============================================================
// REGISTER STUDENT
// Student registers → TRIAL immediately → can chat 5 messages
// WhatsApp to parent fires AFTER trial exhausted
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
    const parentTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const totalStudents = await prisma.student.count();
    const isFirstAdopter = totalStudents < 10000;

    // Create student as TRIAL — immediate access, no payment gate
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

    // Store tier in token for later payment flow
    const paymentLink = `${process.env.FRONTEND_URL}/parent/approve?token=${parentApprovalToken}&tier=${tier}`;

    // WhatsApp to parent stored but NOT sent yet
    // Will fire from zedController after trial exhausted
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

    // TRIAL gets all 5 subjects to explore freely
    // ACTIVE gets subjects based on subjectAccess
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

module.exports = { registerStudent, loginStudent, sendWhatsApp };