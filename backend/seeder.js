import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import products from './data/sampleData.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const sampleProducts = products.map((product) => ({ ...product }));

await Product.deleteMany();
await Product.insertMany(sampleProducts);

console.log(`${sampleProducts.length} sample products added successfully`);

process.exit();