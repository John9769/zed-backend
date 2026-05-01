const express = require('express');
const router = express.Router();
const { sendMessage, getSessionHistory, getSessions } = require('../controllers/zedController');
const { authenticateStudent } = require('../middleware/auth');

router.post('/chat', authenticateStudent, sendMessage);
router.get('/sessions', authenticateStudent, getSessions);
router.get('/sessions/:sessionId', authenticateStudent, getSessionHistory);

module.exports = router;