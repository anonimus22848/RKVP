const pool = require('../db/pool');

class Product {
  // Получить все товары
  static async findAll() {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    return result.rows;
  }

  // Универсальный метод: поиск + фильтрация + сортировка
  static async filter({ search, brand, minPrice, maxPrice, sort } = {}) {
    const conditions = [];
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`(name ILIKE $${values.length} OR brand ILIKE $${values.length})`);
    }
    if (brand) {
      values.push(brand);
      conditions.push(`brand = $${values.length}`);
    }
    if (minPrice) {
      values.push(Number(minPrice));
      conditions.push(`price >= $${values.length}`);
    }
    if (maxPrice) {
      values.push(Number(maxPrice));
      conditions.push(`price <= $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortMap = {
      price_asc: 'price ASC',
      price_desc: 'price DESC',
      name_asc: 'name ASC',
      rating_desc: 'rating DESC',
    };
    const orderBy = sortMap[sort] || 'id ASC';

    const result = await pool.query(
      `SELECT * FROM products ${where} ORDER BY ${orderBy}`,
      values
    );
    return result.rows;
  }

  // Получить один товар по ID
  static async findById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Создать новый товар
  static async create({ name, description, price, brand, image_url }) {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, brand, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, price, brand, image_url]
    );
    return result.rows[0];
  }

  // Обновить товар
  static async update(id, { name, description, price, brand, image_url }) {
    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           brand = COALESCE($4, brand),
           image_url = COALESCE($5, image_url)
       WHERE id = $6
       RETURNING *`,
      [name, description, price, brand, image_url, id]
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