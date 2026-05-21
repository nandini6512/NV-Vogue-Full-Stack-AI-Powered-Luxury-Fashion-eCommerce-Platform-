import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    await connectDB();

    // 1. Clear database
    console.log('[Seed] Wiping clean database tables...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Create seed users
    console.log('[Seed] Registering pre-configured User & Admin profiles...');
    
    // Passwords will be pre-hashed on save by our model middleware!
    const createdUsers = await User.create([
      {
        name: 'NV Admin',
        email: 'admin@nv.com',
        password: 'password123',
        isAdmin: true,
        addresses: [
          {
            street: '100 Haute Couture Blvd',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            isDefault: true
          }
        ]
      },
      {
        name: 'NV Customer',
        email: 'user@nv.com',
        password: 'password123',
        isAdmin: false,
        addresses: [
          {
            street: '42 Fashion Avenue',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90001',
            country: 'USA',
            isDefault: true
          }
        ]
      }
    ]);

    console.log('[Seed] User accounts loaded successfully.');

    // 3. Load products seed file
    const rawProducts = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8')
    );

    // Insert products into catalog
    console.log('[Seed] Seeding premium fashion catalog catalog...');
    await Product.insertMany(rawProducts);

    console.log('[Seed] Database successfully seeded with high-fidelity records!');
    process.exit();
  } catch (error) {
    console.error(`[Seed Error] process encountered a fatal error: ${error.message}`);
    process.exit(1);
  }
};

importData();
