const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================================
// ADMIN LOGIN
// ============================================================

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Admin login successful.',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('adminLogin error:', error.message);
    return res.status(500).json({ error: 'Login failed.' });
  }
};

// ============================================================
// DASHBOARD SUMMARY
// ============================================================

const getDashboard = async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      pendingStudents,
      expiredStudents,
      suspendedStudents,
      totalParents,
      totalRevenue,
      firstAdopters,
      totalReferrals,
      activeReferrals,
      totalSubjectContent,
      totalPastYearQuestions
    ] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { status: 'ACTIVE' } }),
      prisma.student.count({ where: { status: 'PENDING' } }),
      prisma.student.count({ where: { status: 'EXPIRED' } }),
      prisma.student.count({ where: { status: 'SUSPENDED' } }),
      prisma.parent.count(),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true }
      }),
      prisma.student.count({ where: { isFirstAdopter: true } }),
      prisma.referral.count(),
      prisma.referral.count({ where: { status: 'ACTIVE' } }),
      prisma.subjectContent.count(),
      prisma.pastYearQuestion.count()
    ]);

    return res.status(200).json({
      students: {
        total: totalStudents,
        active: activeStudents,
        pending: pendingStudents,
        expired: expiredStudents,
        suspended: suspendedStudents,
        firstAdopters,
        slotsRemaining: Math.max(0, 10000 - firstAdopters)
      },
      parents: { total: totalParents },
      revenue: {
        total: totalRevenue._sum.amount || 0
      },
      referrals: {
        total: totalReferrals,
        active: activeReferrals
      },
      ragContent: {
        subjectContent: totalSubjectContent,
        pastYearQuestions: totalPastYearQuestions
      }
    });

  } catch (error) {
    console.error('getDashboard error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch dashboard.' });
  }
};

// ============================================================
// GET ALL STUDENTS
// ============================================================

const getAllStudents = async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const where = {
      ...(status ? { status } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { mobile: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          parent: { select: { name: true, whatsapp: true, relationship: true } },
          subscription: { select: { tier: true, isActive: true, endDate: true } },
          subjectAccess: { select: { subject: true } },
          zedCredits: { select: { balance: true, fundBalance: true } }
        }
      }),
      prisma.student.count({ where })
    ]);

    return res.status(200).json({
      students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('getAllStudents error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch students.' });
  }
};

// ============================================================
// GET STUDENT DETAIL
// ============================================================

const getStudentDetail = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: true,
        subscription: { include: { payments: true } },
        subjectAccess: true,
        subjectProgress: true,
        zedCredits: { include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } } },
        referralsSent: { include: { referredStudent: { select: { name: true, status: true } } } },
        milestones: { orderBy: { createdAt: 'desc' } },
        approvalLogs: { orderBy: { createdAt: 'desc' } },
        _count: {
          select: {
            chatSessions: true,
            questionAttempts: true,
            referralsSent: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    return res.status(200).json({ student });

  } catch (error) {
    console.error('getStudentDetail error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch student.' });
  }
};

// ============================================================
// SUSPEND STUDENT
// ============================================================

const suspendStudent = async (req, res) => {
  const { studentId } = req.params;
  const { reason } = req.body;

  try {
    await prisma.student.update({
      where: { id: studentId },
      data: { status: 'SUSPENDED' }
    });

    await prisma.studentApprovalLog.create({
      data: {
        studentId,
        action: 'SUSPENDED',
        triggeredBy: 'ADMIN_MANUAL',
        note: reason || 'No reason provided'
      }
    });

    return res.status(200).json({ message: 'Student suspended.' });

  } catch (error) {
    console.error('suspendStudent error:', error.message);
    return res.status(500).json({ error: 'Failed to suspend student.' });
  }
};

// ============================================================
// ACTIVATE STUDENT (manual override)
// ============================================================

const activateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { note } = req.body;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { subscription: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    await prisma.student.update({
      where: { id: studentId },
      data: {
        status: 'ACTIVE',
        parentApprovedAt: new Date(),
        parentApprovalToken: null,
        parentTokenExpiry: null
      }
    });

    // Create wallet if not exists
    await prisma.zedCredit.upsert({
      where: { studentId },
      update: {},
      create: {
        studentId,
        balance: 0,
        fundBalance: 0,
        escrowLocked: true
      }
    });

    await prisma.studentApprovalLog.create({
      data: {
        studentId,
        action: 'ADMIN_ACTIVATED',
        triggeredBy: 'ADMIN_MANUAL',
        note: note || 'Manual activation by admin'
      }
    });

    return res.status(200).json({ message: 'Student activated.' });

  } catch (error) {
    console.error('activateStudent error:', error.message);
    return res.status(500).json({ error: 'Failed to activate student.' });
  }
};

// ============================================================
// GET ALL PARENTS
// ============================================================

const getAllParents = async (req, res) => {
  try {
    const parents = await prisma.parent.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        students: { select: { name: true, status: true } },
        payments: { select: { amount: true, status: true, paidAt: true } }
      }
    });

    return res.status(200).json({ parents });

  } catch (error) {
    console.error('getAllParents error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch parents.' });
  }
};

// ============================================================
// SEED SUBJECT CONTENT (RAG Knowledge Base)
// ============================================================

const seedSubjectContent = async (req, res) => {
  const { subject, form, chapter, topic, title, body, source } = req.body;

  try {
    if (!subject || !form || !chapter || !topic || !title || !body) {
      return res.status(400).json({ error: 'All fields are required except source.' });
    }

    const content = await prisma.subjectContent.create({
      data: { subject, form, chapter, topic, title, body, source: source || null }
    });

    return res.status(201).json({
      message: 'Subject content seeded successfully.',
      content
    });

  } catch (error) {
    console.error('seedSubjectContent error:', error.message);
    return res.status(500).json({ error: 'Failed to seed content.' });
  }
};

// ============================================================
// GET SUBJECT CONTENT
// ============================================================

const getSubjectContent = async (req, res) => {
  const { subject, form } = req.query;

  try {
    const content = await prisma.subjectContent.findMany({
      where: {
        ...(subject ? { subject } : {}),
        ...(form ? { form } : {})
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({ content });

  } catch (error) {
    console.error('getSubjectContent error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch content.' });
  }
};

// ============================================================
// DELETE SUBJECT CONTENT
// ============================================================

const deleteSubjectContent = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.subjectContent.delete({ where: { id } });
    return res.status(200).json({ message: 'Content deleted.' });
  } catch (error) {
    console.error('deleteSubjectContent error:', error.message);
    return res.status(500).json({ error: 'Failed to delete content.' });
  }
};

// ============================================================
// SEED PAST YEAR QUESTION
// ============================================================

const seedPastYearQuestion = async (req, res) => {
  const { subject, form, year, questionNo, question, markingScheme, marks } = req.body;

  try {
    if (!subject || !form || !year || !question || !markingScheme) {
      return res.status(400).json({ error: 'subject, form, year, question and markingScheme are required.' });
    }

    const paq = await prisma.pastYearQuestion.create({
      data: {
        subject,
        form,
        year: parseInt(year),
        questionNo: questionNo || null,
        question,
        markingScheme,
        marks: marks ? parseInt(marks) : null
      }
    });

    return res.status(201).json({
      message: 'Past year question seeded successfully.',
      question: paq
    });

  } catch (error) {
    console.error('seedPastYearQuestion error:', error.message);
    return res.status(500).json({ error: 'Failed to seed question.' });
  }
};

// ============================================================
// DELETE PAST YEAR QUESTION
// ============================================================

const deletePastYearQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pastYearQuestion.delete({ where: { id } });
    return res.status(200).json({ message: 'Question deleted.' });
  } catch (error) {
    console.error('deletePastYearQuestion error:', error.message);
    return res.status(500).json({ error: 'Failed to delete question.' });
  }
};

// ============================================================
// GET ALL REFERRALS
// ============================================================

const getReferrals = async (req, res) => {
  const { status } = req.query;

  try {
    const referrals = await prisma.referral.findMany({
      where: { ...(status ? { status } : {}) },
      orderBy: { createdAt: 'desc' },
      include: {
        referrerStudent: { select: { name: true, mobile: true } },
        referredStudent: { select: { name: true, mobile: true, status: true } }
      }
    });

    return res.status(200).json({ referrals });

  } catch (error) {
    console.error('getReferrals error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch referrals.' });
  }
};

// ============================================================
// GET ALL CREDITS
// ============================================================

const getCredits = async (req, res) => {
  try {
    const credits = await prisma.zedCredit.findMany({
      orderBy: { balance: 'desc' },
      include: {
        student: { select: { name: true, mobile: true, status: true } },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    const totalCreditsInSystem = credits.reduce((sum, c) => sum + c.balance, 0);
    const totalFundInSystem = credits.reduce((sum, c) => sum + c.fundBalance, 0);

    return res.status(200).json({
      credits,
      summary: {
        totalCreditsInSystem,
        totalFundInSystem
      }
    });

  } catch (error) {
    console.error('getCredits error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch credits.' });
  }
};

module.exports = {
  adminLogin,
  getDashboard,
  getAllStudents,
  getStudentDetail,
  suspendStudent,
  activateStudent,
  getAllParents,
  seedSubjectContent,
  getSubjectContent,
  deleteSubjectContent,
  seedPastYearQuestion,
  deletePastYearQuestion,
  getReferrals,
  getCredits
};