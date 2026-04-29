import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getBookingStats,
  BOOKING_STATUS
} from '../services/bookingService.js';

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking (can be guest or authenticated)
 */
router.post('/', (req, res) => {
  const userId = req.user?.id || 'guest';
  try {
    const booking = createBooking({ userId, ...req.body });
    res.status(201).json({
      success: true,
      message: `Booking confirmed! Your confirmation ID is ${booking.confirmationId}`,
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/bookings/mine (protected)
 * Get all bookings for the logged-in user
 */
router.get('/mine', authenticate, (req, res) => {
  const bookings = getUserBookings(req.user.id);
  res.json({ success: true, count: bookings.length, data: bookings });
});

/**
 * GET /api/bookings/stats (protected)
 * Get booking stats for dashboard widget
 */
router.get('/stats', authenticate, (req, res) => {
  const stats = getBookingStats(req.user.id);
  res.json({ success: true, data: stats });
});

/**
 * GET /api/bookings/:id (protected)
 * Get a single booking by ID
 */
router.get('/:id', authenticate, (req, res) => {
  const booking = getBookingById(req.params.id, req.user.id);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }
  res.json({ success: true, data: booking });
});

/**
 * PATCH /api/bookings/:id/cancel (protected)
 * Cancel a booking
 */
router.patch('/:id/cancel', authenticate, (req, res) => {
  const result = cancelBooking(req.params.id, req.user.id);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json({ success: true, message: 'Booking cancelled successfully.', data: result.booking });
});

export default router;
