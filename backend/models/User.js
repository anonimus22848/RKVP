// backend/models/User.js
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

class User {
  // Создание нового пользователя (хеширует пароль)
  static async create({ login, email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (login, email, password_hash, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, login, email, name, role, created_at`,
      [login, email, hashedPassword, name]
    );
    return result.rows[0];
  }

  // Поиск пользователя по логину
  static async findByLogin(login) {
    const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    return result.rows[0];
  }

  // Поиск пользователя по email
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  // Поиск пользователя по ID (без пароля)
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, login, email, name, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Сравнение введённого пароля с хешем из БД
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;