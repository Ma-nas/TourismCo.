import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import destinationRoutes from './routes/destinations.js';
import circleRoutes from './routes/circles.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import itineraryRoutes from './routes/itinerary.js';
import bookingRoutes from './routes/bookings.js';
import { errorHandler } from './middleware/auth.js';

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ 
  origin: function (origin, callback) {
    callback(null, true);
  }, 
  credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (generous for serverless / live chat)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/circles', circleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    app: process.env.APP_NAME || 'TourismCo',
    region: process.env.APP_REGION || 'Uttar Pradesh',
    currency: process.env.APP_CURRENCY || 'INR',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

export default app;
