import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// POST - create a product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - all products with filtering, sorting and pagination
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy } = req.query;

    // 1. Filtering
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 2. Sorting (_id is a tie-breaker so pages stay consistent)
    const sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    sort._id = 1;

    // 3. Pagination (defaults: page 1, limit 10, max limit 100)
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // 4. Build + run the query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid query parameter' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET - one product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT - update a product by id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the UPDATED doc, not the old one
      runValidators: true, // still enforce the schema rules on updates
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error', error: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE - remove a product by id
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;