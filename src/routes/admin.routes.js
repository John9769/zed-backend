const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
  adminLogin,
  getDashboard,
  getAllStudents,
  getStudentDetail,
  suspendStudent,
  activateStudent,
  getAllParents,
  seedSubjectContent,
  seedPastYearQuestion,
  getSubjectContent,
  deletePastYearQuestion,
  deleteSubjectContent,
  getReferrals,
  getCredits
} = require('../controllers/adminController');

// Admin auth
router.post('/login', adminLogin);

// Dashboard
router.get('/dashboard', authenticateAdmin, getDashboard);

// Students
router.get('/students', authenticateAdmin, getAllStudents);
router.get('/students/:studentId', authenticateAdmin, getStudentDetail);
router.put('/students/:studentId/suspend', authenticateAdmin, suspendStudent);
router.put('/students/:studentId/activate', authenticateAdmin, activateStudent);

// Parents
router.get('/parents', authenticateAdmin, getAllParents);

// RAG Content
router.post('/content/subject', authenticateAdmin, seedSubjectContent);
router.get('/content/subject', authenticateAdmin, getSubjectContent);
router.delete('/content/subject/:id', authenticateAdmin, deleteSubjectContent);
router.post('/content/questions', authenticateAdmin, seedPastYearQuestion);
router.delete('/content/questions/:id', authenticateAdmin, deletePastYearQuestion);

// Credits & Referrals
router.get('/referrals', authenticateAdmin, getReferrals);
router.get('/credits', authenticateAdmin, getCredits);

module.exports = router;