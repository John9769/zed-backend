const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Zed BE is alive 🧠' });
});

const authRoutes = require('./src/routes/auth.routes');
const adminRoutes = require('./src/routes/admin.routes');
const zedRoutes = require('./src/routes/zed.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const creditRoutes = require('./src/routes/credit.routes');

app.use('/api/auth',    authRoutes.default || authRoutes);
app.use('/api/admin',   adminRoutes.default || adminRoutes);
app.use('/api/zed',     zedRoutes.default || zedRoutes);
app.use('/api/payment', paymentRoutes.default || paymentRoutes);
app.use('/api/credit',  creditRoutes.default || creditRoutes);
app.use('/api/upload', require('./src/routes/upload.routes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Zed BE running on port ${PORT}`));

module.exports = app;