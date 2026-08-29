import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';

const httpServer = createServer(app);

// ─── Socket.IO (for real-time group chat & live tracking) ────────────────────
const io = new SocketIO(httpServer, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ['GET', 'POST'],
    credentials: true
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

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log('');
  console.log('🚀 TourismCo. Backend Server');
  console.log(`📍 Region: ${process.env.APP_REGION || 'Uttar Pradesh'}`);
  console.log(`💰 Currency: ${process.env.APP_CURRENCY || 'INR'} (${process.env.APP_CURRENCY_SYMBOL || '₹'})`);
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
