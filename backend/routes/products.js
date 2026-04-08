
const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/products – публичный список товаров
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id – публичный детальный просмотр
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products – защищённый, создание товара
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const product = await Product.create({ name, description, price, brand });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id – защищённый, обновление товара
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id – защищённый, удаление товара
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    await Product.delete(req.params.id);
    res.status(204).send(); // 204 No Content – успешное удаление без тела
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;