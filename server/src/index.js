import 'express-async-errors';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
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
const httpServer = createServer(app);

// ─── Socket.IO (for real-time group chat & live tracking) ────────────────────
const io = new SocketIO(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 WebSocket connected: ${socket.id}`);

  // Join a travel circle room
  socket.on('join:circle', (circleId) => {
    socket.join(`circle:${circleId}`);
    console.log(`👥 ${socket.id} joined circle ${circleId}`);
  });

  // Group chat message
  socket.on('message:send', ({ circleId, message, user }) => {
    io.to(`circle:${circleId}`).emit('message:receive', {
      id: Date.now(),
      user,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Live location (consent-based)
  socket.on('location:update', ({ circleId, userId, lat, lng }) => {
    socket.to(`circle:${circleId}`).emit('location:updated', {
      userId, lat, lng, timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 WebSocket disconnected: ${socket.id}`);
  });
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
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
    app: process.env.APP_NAME,
    region: process.env.APP_REGION,
    currency: process.env.APP_CURRENCY,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 TourismCo. Backend Server');
  console.log(`📍 Region: ${process.env.APP_REGION}`);
  console.log(`💰 Currency: ${process.env.APP_CURRENCY} (${process.env.APP_CURRENCY_SYMBOL})`);
  console.log(`🌐 Running at http://localhost:${PORT}`);
  console.log('');
  console.log('📡 Available Endpoints:');
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/register  | POST /api/auth/login`);
  console.log(`   GET  /api/destinations   | GET  /api/destinations/search`);
  console.log(`   GET  /api/destinations/matches`);
  console.log(`   GET  /api/circles        | POST /api/circles/:id/join`);
  console.log(`   POST /api/ai/chat        | POST /api/ai/chat/message (PRD)`);
  console.log(`   POST /api/ai/plan        | GET  /api/ai/stats | GET /api/ai/recommendations`);
  console.log(`   GET  /api/ai/booking-links?destination=Varanasi`);
  console.log(`   GET  /api/ai/stats       | GET  /api/ai/recommendations`);
  console.log(`   GET  /api/itinerary/options/:city`);
  console.log(`   POST /api/itinerary/calculate`);
  console.log(`   POST /api/itinerary/build`);
  console.log(`   POST /api/itinerary/save  (auth) | GET /api/itinerary/mine (auth)`);
  console.log(`   POST /api/bookings        | GET  /api/bookings/mine (auth)`);
  console.log(`   GET  /api/bookings/stats  | PATCH /api/bookings/:id/cancel`);
  console.log('');
  console.log('🔌 WebSocket: Real-time group chat & live location active');
});

export { io };
