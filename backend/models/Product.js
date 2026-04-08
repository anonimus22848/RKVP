
const pool = require('../db/pool');

class Product {
  // Получить все товары (сортировка по ID)
  static async findAll() {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    return result.rows;
  }

  // Получить один товар по ID
  static async findById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Создать новый товар
  static async create({ name, description, price, brand }) {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, brand)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, price, brand]
    );
    return result.rows[0];
  }

  // Обновить товар (частичное обновление: если поле не указано, оставляем старое)
  static async update(id, { name, description, price, brand }) {
    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           brand = COALESCE($4, brand)
       WHERE id = $5
       RETURNING *`,
      [name, description, price, brand, id]
    );
    return result.rows[0];
  }

  // Удалить товар
  static async delete(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  }
}

module.exports = Product;