const prisma = require('../lib/prisma');

// ============================================================
// GET MY CREDITS — Student views their wallet
// ============================================================

const getMyCredits = async (req, res) => {
  const studentId = req.student.studentId;

  try {
    const credit = await prisma.zedCredit.findUnique({
      where: { studentId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!credit) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    // All active referrals grouped by referred student
    const activeReferrals = await prisma.referral.findMany({
      where: { referrerStudentId: studentId, status: 'ACTIVE' },
      include: {
        referredStudent: { select: { name: true, mobile: true } }
      }
    });

    // RM5 per active referral per subject
    const monthlyEarning = activeReferrals.reduce((sum, r) => sum + r.creditAmount, 0);

    // Group by referred student for clean display
    const friendMap = {};
    for (const r of activeReferrals) {
      const key = r.referredStudentId;
      if (!friendMap[key]) {
        friendMap[key] = {
          friendName: r.referredStudent.name,
          subjects: [],
          totalMonthly: 0
        };
      }
      friendMap[key].subjects.push(r.subject);
      friendMap[key].totalMonthly += r.creditAmount;
    }

    return res.status(200).json({
      wallet: {
        balance: credit.balance,
        fundBalance: credit.fundBalance,
        escrowLocked: credit.escrowLocked,
        convertedToFund: credit.convertedToFund
      },
      referrals: {
        activeCount: activeReferrals.length,
        monthlyEarning,
        friends: Object.values(friendMap)
      },
      recentTransactions: credit.transactions
    });

  } catch (error) {
    console.error('getMyCredits error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch credits.' });
  }
};

// ============================================================
// GET MY TRANSACTIONS — Full credit history
// ============================================================

const getMyTransactions = async (req, res) => {
  const studentId = req.student.studentId;
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const credit = await prisma.zedCredit.findUnique({ where: { studentId } });
    if (!credit) return res.status(404).json({ error: 'Wallet not found.' });

    const [transactions, total] = await Promise.all([
      prisma.zedCreditTransaction.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.zedCreditTransaction.count({ where: { studentId } })
    ]);

    return res.status(200).json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('getMyTransactions error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch transactions.' });
  }
};

// ============================================================
// PROCESS MONTHLY REFERRAL CREDITS
// Admin triggers monthly — RM5 per active referral per subject
// ============================================================

const processMonthlyReferralCredits = async (req, res) => {
  try {
    const activeReferrals = await prisma.referral.findMany({
      where: { status: 'ACTIVE', recurring: true },
      include: {
        referrerStudent: { include: { zedCredits: true } },
        referredStudent: {
          include: {
            subscriptions: {
              where: { isActive: true }
            }
          }
        }
      }
    });

    if (activeReferrals.length === 0) {
      return res.status(200).json({ message: 'No active referrals to process.' });
    }

    let processed = 0;
    let skipped = 0;
    const results = [];

    for (const referral of activeReferrals) {
      try {
        // Check referred student still has active subscription for this subject
        const activeSub = referral.referredStudent.subscriptions.find(
          s => s.subject === referral.subject && s.isActive && new Date() < s.endDate
        );

        if (!activeSub) {
          await prisma.referral.update({
            where: { id: referral.id },
            data: { status: 'EXPIRED' }
          });
          skipped++;
          continue;
        }

        if (referral.referrerStudent.status !== 'ACTIVE') {
          skipped++;
          continue;
        }

        const creditId = referral.referrerStudent.zedCredits?.id;
        if (!creditId) {
          skipped++;
          continue;
        }

        await prisma.$transaction(async (tx) => {
          await tx.zedCredit.update({
            where: { studentId: referral.referrerStudentId },
            data: { balance: { increment: referral.creditAmount } }
          });

          await tx.zedCreditTransaction.create({
            data: {
              creditId,
              studentId: referral.referrerStudentId,
              amount: referral.creditAmount,
              type: 'EARNED_REFERRAL',
              referralId: referral.id,
              note: `Monthly referral — ${referral.subject} — ${new Date().toLocaleString('en-MY', { month: 'long', year: 'numeric' })}`
            }
          });
        });

        processed++;
        results.push({
          referrerId: referral.referrerStudentId,
          referrerName: referral.referrerStudent.name,
          subject: referral.subject,
          amount: referral.creditAmount
        });

      } catch (err) {
        console.error(`Failed referral ${referral.id}:`, err.message);
        skipped++;
      }
    }

    return res.status(200).json({
      message: 'Monthly referral credits processed.',
      processed,
      skipped,
      results
    });

  } catch (error) {
    console.error('processMonthlyReferralCredits error:', error.message);
    return res.status(500).json({ error: 'Failed to process monthly credits.' });
  }
};

// ============================================================
// RELEASE ESCROW — Admin unlocks student credits
// ============================================================

const releaseEscrow = async (req, res) => {
  const { studentId } = req.params;
  const { note } = req.body;

  try {
    const credit = await prisma.zedCredit.findUnique({ where: { studentId } });
    if (!credit) return res.status(404).json({ error: 'Wallet not found.' });
    if (!credit.escrowLocked) return res.status(400).json({ error: 'Escrow already released.' });

    await prisma.$transaction(async (tx) => {
      await tx.zedCredit.update({
        where: { studentId },
        data: { escrowLocked: false }
      });

      await tx.zedCreditTransaction.create({
        data: {
          creditId: credit.id,
          studentId,
          amount: 0,
          type: 'ESCROW_RELEASED',
          note: note || 'Escrow released by admin'
        }
      });
    });

    return res.status(200).json({ message: 'Escrow released.' });

  } catch (error) {
    console.error('releaseEscrow error:', error.message);
    return res.status(500).json({ error: 'Failed to release escrow.' });
  }
};

// ============================================================
// CONVERT TO FUND — Student converts credit balance to Zed Fund
// Only after escrow released by admin
// ============================================================

const convertToFund = async (req, res) => {
  const studentId = req.student.studentId;

  try {
    const credit = await prisma.zedCredit.findUnique({ where: { studentId } });
    if (!credit) return res.status(404).json({ error: 'Wallet not found.' });

    if (credit.escrowLocked) {
      return res.status(403).json({
        error: 'Your Zed Fund is still locked. Keep referring friends — admin will release it soon! 💪'
      });
    }

    if (credit.balance <= 0) return res.status(400).json({ error: 'No credits to convert.' });
    if (credit.convertedToFund) return res.status(400).json({ error: 'Already converted to Zed Fund.' });

    const amountToConvert = credit.balance;

    await prisma.$transaction(async (tx) => {
      await tx.zedCredit.update({
        where: { studentId },
        data: {
          fundBalance: { increment: amountToConvert },
          balance: 0,
          convertedToFund: true
        }
      });

      await tx.zedCreditTransaction.create({
        data: {
          creditId: credit.id,
          studentId,
          amount: amountToConvert,
          type: 'CONVERTED_TO_FUND',
          note: `RM${amountToConvert.toFixed(2)} converted to Zed Fund`
        }
      });
    });

    return res.status(200).json({
      message: `RM${amountToConvert.toFixed(2)} converted to your Zed Fund! This is your future. 🎓`,
      fundBalance: credit.fundBalance + amountToConvert
    });

  } catch (error) {
    console.error('convertToFund error:', error.message);
    return res.status(500).json({ error: 'Failed to convert credits.' });
  }
};

module.exports = {
  getMyCredits,
  getMyTransactions,
  processMonthlyReferralCredits,
  releaseEscrow,
  convertToFund
};