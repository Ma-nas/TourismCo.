import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getCustomizationOptions,
  calculateCost,
  buildCustomItinerary,
  saveItinerary,
  getUserItineraries,
  deleteItinerary
} from '../services/itineraryService.js';

const router = express.Router();

/**
 * GET /api/itinerary/options/:city
 * Returns all customization options for a given city
 */
router.get('/options/:city', (req, res) => {
  const options = getCustomizationOptions(req.params.city);
  res.json({ success: true, data: options });
});

/**
 * POST /api/itinerary/calculate
 * Body: { cityName, days, travelers, accommodationId, transportId, mealPlanId, activityIds }
 * Returns: cost breakdown in INR
 */
router.post('/calculate', (req, res) => {
  const { cityName, days, travelers, accommodationId, transportId, mealPlanId, activityIds } = req.body;
  if (!cityName || !days) {
    return res.status(400).json({ success: false, message: 'cityName and days are required.' });
  }
  const cost = calculateCost({ cityName, days: parseInt(days), travelers: parseInt(travelers) || 1, accommodationId, transportId, mealPlanId, activityIds: activityIds || [] });
  res.json({ success: true, data: cost });
});

/**
 * POST /api/itinerary/build
 * Body: full customization object
 * Returns: day-wise itinerary with cost summary
 */
router.post('/build', (req, res) => {
  const {
    cityName, days, travelers, accommodationId, transportId,
    mealPlanId, activityIds, travelStyle, interests
  } = req.body;

  if (!cityName || !days) {
    return res.status(400).json({ success: false, message: 'cityName and days are required.' });
  }

  const itinerary = buildCustomItinerary({
    cityName,
    days: parseInt(days),
    travelers: parseInt(travelers) || 1,
    accommodationId, transportId, mealPlanId,
    activityIds: activityIds || [],
    travelStyle: travelStyle || 'balanced',
    interests: interests || []
  });

  res.json({ success: true, data: itinerary });
});

/**
 * POST /api/itinerary/save (protected)
 * Saves itinerary to user's account
 */
router.post('/save', authenticate, (req, res) => {
  const saved = saveItinerary(req.user.id, req.body);
  res.status(201).json({ success: true, data: saved });
});

/**
 * GET /api/itinerary/mine (protected)
 * Returns all saved itineraries for the logged-in user
 */
router.get('/mine', authenticate, (req, res) => {
  const items = getUserItineraries(req.user.id);
  res.json({ success: true, count: items.length, data: items });
});

/**
 * DELETE /api/itinerary/:id (protected)
 */
router.delete('/:id', authenticate, (req, res) => {
  const deleted = deleteItinerary(req.params.id, req.user.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Itinerary not found.' });
  res.json({ success: true, message: 'Itinerary deleted.' });
});

export default router;
