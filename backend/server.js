import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Routers
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect MongoDB Database
connectDB();

const app = express();

// Set up middlewares
app.use(cors({
  origin: '*', // Allow all client connections for simple portability and local testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Main Root Endpoint Greeting
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the NV Vogue Premium Full-Stack API Gateway!' });
});

// Map API Route Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[NV Vogue Server] online in development mode`);
  console.log(`[NV Vogue Server] REST API Gateway listening on http://localhost:${PORT}`);
});
