const express = require('express');
const router = express.Router();
const { createBill, billplzWebhook } = require('../controllers/paymentController');

router.post('/create-bill', createBill);
router.post('/webhook', billplzWebhook);

module.exports = router;