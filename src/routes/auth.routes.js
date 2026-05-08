const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, requestParentApproval, addSubject } = require('../controllers/authController');
const { authenticateStudent } = require('../middleware/auth');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/request-approval', authenticateStudent, requestParentApproval);
router.post('/add-subject', authenticateStudent, addSubject);

module.exports = router;