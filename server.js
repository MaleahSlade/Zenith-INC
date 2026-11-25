import 'dotenv/config';
import express from 'express';
import connectDB from './config/connection.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // lets Express read JSON from req.body
app.get('/', (req, res) => res.json({ message: 'Zenith API is running' }));
app.use('/api/products', productRoutes);
connectDB().then(() => {
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});