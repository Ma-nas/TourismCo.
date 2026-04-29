/**
 * Booking Service
 * Handles trip bookings, status management, and confirmations
 */

import { v4 as uuidv4 } from 'uuid';
import { bookings } from '../config/bookingStore.js';
import { destinations } from '../config/dataStore.js';

// ─── Booking status enum ──────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  ACTIVE:    'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ─── Create a booking ─────────────────────────────────────────────────────────
export const createBooking = ({
  userId, userName, userEmail,
  destinationId, destinationName,
  startDate, endDate, days, travelers,
  itineraryId = null,
  accommodationId, accommodationName,
  transportId, transportMode,
  mealPlanId, mealPlanName,
  activityIds = [],
  totalCost, currency = 'INR',
  specialRequests = ''
}) => {
  if (!destinationName || !startDate || !endDate || !travelers || !totalCost) {
    throw new Error('Missing required booking fields: destinationName, startDate, endDate, travelers, totalCost');
  }

  const confirmationId = 'TCO-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const booking = {
    id: uuidv4(),
    confirmationId,
    userId: userId || 'guest',
    userName: userName || 'Guest',
    userEmail: userEmail || '',
    destination: {
      id: destinationId,
      name: destinationName,
    },
    startDate,
    endDate,
    days,
    travelers,
    itineraryId,
    accommodation: { id: accommodationId, name: accommodationName },
    transport: { id: transportId, mode: transportMode },
    mealPlan: { id: mealPlanId, name: mealPlanName },
    activityIds,
    totalCost,
    currency,
    currencySymbol: '₹',
    specialRequests,
    status: BOOKING_STATUS.CONFIRMED,
    paymentStatus: 'paid', // mock
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  bookings.push(booking);
  return booking;
};

// ─── Get all bookings for a user ──────────────────────────────────────────────
export const getUserBookings = (userId) => {
  return bookings
    .filter(b => b.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// ─── Get a single booking ─────────────────────────────────────────────────────
export const getBookingById = (bookingId, userId) => {
  return bookings.find(b => b.id === bookingId && b.userId === userId) || null;
};

// ─── Cancel a booking ─────────────────────────────────────────────────────────
export const cancelBooking = (bookingId, userId) => {
  const booking = bookings.find(b => b.id === bookingId && b.userId === userId);
  if (!booking) return { success: false, message: 'Booking not found.' };
  if (booking.status === BOOKING_STATUS.COMPLETED) {
    return { success: false, message: 'Cannot cancel a completed trip.' };
  }
  booking.status = BOOKING_STATUS.CANCELLED;
  booking.updatedAt = new Date().toISOString();
  return { success: true, booking };
};

// ─── Update booking status ────────────────────────────────────────────────────
export const updateBookingStatus = (bookingId, newStatus) => {
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return null;
  booking.status = newStatus;
  booking.updatedAt = new Date().toISOString();
  return booking;
};

// ─── Get booking stats (for dashboard) ───────────────────────────────────────
export const getBookingStats = (userId) => {
  const userBookings = bookings.filter(b => b.userId === userId);
  return {
    total: userBookings.length,
    confirmed: userBookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length,
    active: userBookings.filter(b => b.status === BOOKING_STATUS.ACTIVE).length,
    completed: userBookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length,
    cancelled: userBookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length,
    totalSpent: userBookings
      .filter(b => b.status !== BOOKING_STATUS.CANCELLED)
      .reduce((sum, b) => sum + b.totalCost, 0),
    currency: 'INR',
    symbol: '₹'
  };
};
