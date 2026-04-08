
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration } = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// POST /api/auth/register - регистрация нового пользователя
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { login, email, password, name } = req.body;

    // Проверяем, не занят ли логин
    const existingLogin = await User.findByLogin(login);
    if (existingLogin) {
      return res.status(400).json({ error: 'Login already exists' });
    }

    // Проверяем, не занят ли email
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Создаём пользователя (пароль хешируется внутри модели)
    const user = await User.create({ login, email, password, name });

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Отправляем ответ (пароль не возвращаем)
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login - вход пользователя
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Login and password required' });
    }

    // Ищем пользователя по логину
    const user = await User.findByLogin(login);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Сравниваем пароль
    const isValid = await User.comparePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Генерируем токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Возвращаем токен и данные пользователя (без хеша пароля)
    res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me - получить данные текущего пользователя (требует токен)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;