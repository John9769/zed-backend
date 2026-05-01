const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// ============================================================
// REGISTER STUDENT
// Student fills form → system creates parent + student (PENDING)
// → fires WhatsApp to parent with payment link
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
    tier  // THREE_SUBJECTS or FIVE_SUBJECTS
  } = req.body;

  try {
    // 1. Check if student mobile already exists
    const existingStudent = await prisma.student.findUnique({
      where: { mobile: studentMobile }
    });
    if (existingStudent) {
      return res.status(400).json({ error: 'Mobile number already registered.' });
    }

    // 2. Check if parent whatsapp already exists — reuse if yes (siblings)
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

    // 3. Validate invite code if provided
    let referrerStudent = null;
    if (inviteCode) {
      referrerStudent = await prisma.student.findUnique({
        where: { referralCode: inviteCode }
      });
      if (!referrerStudent) {
        return res.status(400).json({ error: 'Invalid invite code.' });
      }
    }

    // 4. Hash password
    const passwordHash = await bcrypt.hash(studentPassword, 10);

    // 5. Generate unique referral code for this student
    const referralCode = uuidv4().split('-')[0].toUpperCase(); // e.g. A3F2B1

    // 6. Generate parent approval token
    const parentApprovalToken = uuidv4();
    const parentTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hrs

    // 7. Check first adopter status
    const totalStudents = await prisma.student.count();
    const isFirstAdopter = totalStudents < 10000;

    // 8. Create student (PENDING)
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
        status: 'PENDING'
      }
    });

    // 9. Build Billplz payment URL for parent
    // Billplz will be wired later — for now store tier in token flow
    const paymentLink = `${process.env.FRONTEND_URL}/parent/approve?token=${parentApprovalToken}&tier=${tier}`;

    // 10. Send WhatsApp to parent via UltraMsg
    await sendWhatsApp(
      parentWhatsapp,
      `Salam ${parentName} 👋\n\nAnak anda *${studentName}* telah mendaftar di *ZED* — AI Tutor peribadi untuk SPM.\n\n✅ Klik link di bawah untuk tahu lebih lanjut dan aktifkan akaun anak anda:\n\n${paymentLink}\n\n_Link ini sah selama 24 jam._`
    );

    return res.status(201).json({
      message: 'Registration successful. WhatsApp sent to parent for approval.',
      studentId: student.id,
      referralCode: student.referralCode
    });

  } catch (error) {
    console.error('registerStudent error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ============================================================
// LOGIN STUDENT
// Only ACTIVE students can login
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

    const token = jwt.sign(
      {
        studentId: student.id,
        name: student.name,
        status: student.status,
        subjects: student.subjectAccess.map(s => s.subject)
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
        subjects: student.subjectAccess.map(s => s.subject)
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
        to: `60${to}`,  // Malaysia prefix
        body: message
      }
    );
  } catch (err) {
    console.error('UltraMsg error:', err.message);
    // Don't crash registration if WhatsApp fails
  }
};

module.exports = { registerStudent, loginStudent };