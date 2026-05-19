import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const initDb = async () => {
  await connectDB();
  
  try {
    // Clear existing users
    await User.deleteMany({});

    // Insert default admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin Owner',
      email: 'admin@royaldaawat.com',
      password: hashedPassword,
      role: 'Admin'
    });
    
    console.log("MongoDB initialized successfully with default Admin account: admin@royaldaawat.com / admin123");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
};

initDb();
