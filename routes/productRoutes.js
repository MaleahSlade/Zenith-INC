import Product from '../models/Product.js';
import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
try {
const product = await Product.create(req.body);
res.status(201).json(product);
} catch (error) {
if (error.name === 'ValidationError') {
return res.status(400).json({ message: error.message });
}
res.status(500).json({ message: 'Server error', error: error.message });
}

export default router;