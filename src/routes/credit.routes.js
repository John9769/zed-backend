const express = require('express');
const router = express.Router();
const { authenticateStudent, authenticateAdmin } = require('../middleware/auth');
const {
  getMyCredits,
  getMyTransactions,
  processMonthlyReferralCredits,
  releaseEscrow,
  convertToFund
} = require('../controllers/creditController');

// Student routes
router.get('/my-credits', authenticateStudent, getMyCredits);
router.get('/my-transactions', authenticateStudent, getMyTransactions);
router.post('/convert-to-fund', authenticateStudent, convertToFund);

// Admin routes
router.post('/process-monthly', authenticateAdmin, processMonthlyReferralCredits);
router.post('/release-escrow/:studentId', authenticateAdmin, releaseEscrow);

module.exports = router;