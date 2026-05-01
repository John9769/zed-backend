require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Zed BE is alive 🧠' });
});

// Routes (we add these one by one)
// app.use('/api/auth', require('./src/routes/auth.routes'));
// app.use('/api/admin', require('./src/routes/admin.routes'));
// app.use('/api/zed', require('./src/routes/zed.routes'));
// app.use('/api/payment', require('./src/routes/payment.routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Zed BE running on port ${PORT}`);
});