import Product from '../models/Product.js';
import express from 'express';
const router = express.Router();

//POST
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
});

//Filter Feature
router.get('/', async (req, res) => {
try {
const { category, minPrice, maxPrice } = req.query;
const filter = {};
if (category) filter.category = category;
if (minPrice || maxPrice) {
filter.price = {};
if (minPrice) filter.price.$gte = Number(minPrice); // >=
if (maxPrice) filter.price.$lte = Number(maxPrice); // <=
}
const products = await Product.find(filter);
res.json(products);
} catch (error) {
res.status(500).json({ message: 'Server error', error: error.message });
}
});









//GET
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

//PUT
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
res.status(500).json({ message: 'Server error', error: error.message });
}
});

//DELETE
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