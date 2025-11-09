import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      console.log('   If you want to create a new admin, delete the existing one first.');
      process.exit(0);
    }

    // Create admin user
    // Note: Password will be hashed by the User model's pre-save hook
    // Email must be from gmail.com or gla.ac.in domain (per User model validation)
    const adminData = {
      name: 'Admin User',
      email: 'admin@gmail.com', // Must be gmail.com or gla.ac.in
      password: 'Admin123', // Must meet password requirements: 8+ chars, uppercase, lowercase, number
      role: 'admin',
      phone: '1234567890',
      city: 'Admin City'
    };

    const admin = await User.create(adminData);

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Password: Admin123 (change this after first login)');
    console.log('   Role: admin');
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    
    if (error.code === 11000) {
      console.error('   Email already exists. Please use a different email or delete the existing user.');
    }
    
    process.exit(1);
  }
};

createAdmin();

