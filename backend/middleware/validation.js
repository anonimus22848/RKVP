

/**
 * Middleware для проверки данных при регистрации
 * Если данные некорректны, возвращает ошибку 400.
 * Если всё ок, передаёт управление дальше (next).
 */
function validateRegistration(req, res, next) {
  const { login, email, password, name } = req.body;

  // Проверка наличия обязательных полей
  if (!login || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields: login, email, password' });
  }

  // Минимальная длина пароля
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  // Проверка формата email с помощью регулярного выражения
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

 
  const loginRegex = /^[a-zA-Z0-9_]+$/;
  if (!loginRegex.test(login)) {
    return res.status(400).json({ error: 'Login can only contain letters, numbers and underscore' });
  }

  
  next();
}

module.exports = { validateRegistration };