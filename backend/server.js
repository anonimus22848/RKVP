
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем роуты с префиксом /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Заглушка для корня (опционально)
app.get('/', (req, res) => {
  res.send('PeriHub API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
