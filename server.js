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

app.use('/api/auth',    require('./src/routes/auth.routes'));
app.use('/api/admin',   require('./src/routes/admin.routes'));
app.use('/api/zed',     require('./src/routes/zed.routes'));
app.use('/api/payment', require('./src/routes/payment.routes'));
app.use('/api/credit',  require('./src/routes/credit.routes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Zed BE running on port ${PORT}`));
}

module.exports = app;