// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware для проверки JWT токена.
 * Извлекает токен из заголовка Authorization: Bearer <token>
 * Если токен валиден, добавляет в req.userId и req.userRole.
 * Иначе возвращает 401 Unauthorized.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: no token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

module.exports = authMiddleware;