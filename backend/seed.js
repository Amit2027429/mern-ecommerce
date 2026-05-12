import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import products from './data/sampleData.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: await bcrypt.hash('Admin@123', 10),
      isAdmin: true
    });

    const sampleProducts = products.map((product) => ({ ...product }));
    await Product.insertMany(sampleProducts);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
