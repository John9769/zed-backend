const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, requestParentApproval } = require('../controllers/authController');
const { authenticateStudent } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/request-approval', authenticateStudent, requestParentApproval);

module.exports = router;