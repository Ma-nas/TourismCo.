import express from 'express';
import { processQuery, getTourismStats, getSmartRecommendations } from '../services/aiEngine.js';

const router = express.Router();

/**
 * POST /api/ai/plan
 * Body: { message: "Plan a 5-day trip to Varanasi under ₹15000" }
 * OR   { destination, days, budget }
 */
router.post('/plan', (req, res) => {
  const { message = '', destination, days, budget } = req.body;

  // Build a natural language query from structured params if provided
  const query = message || `Plan a ${days || 3}-day trip to ${destination || ''} under ₹${budget || 15000}`;

  const result = processQuery(query);
  res.json(result);
});

/**
 * POST /api/ai/chat
 * Body: { message: "..." }
 * General conversational endpoint
 */
router.post('/chat', (req, res) => {
  const { message = '' } = req.body;
  if (!message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }
  const result = processQuery(message);
  res.json(result);
});

/**
 * GET /api/ai/stats
 * Returns real UP tourism statistics from government dataset
 */
router.get('/stats', (req, res) => {
  const stats = getTourismStats();
  res.json({ success: true, data: stats });
});

/**
 * GET /api/ai/recommendations?interests=Spiritual,Heritage&budget=15000&days=3
 */
router.get('/recommendations', (req, res) => {
  const { interests = '', budget, days } = req.query;
  const preferences = {
    interests: interests ? interests.split(',') : [],
    budget: budget ? parseInt(budget) : 15000,
    days: days ? parseInt(days) : 3
  };
  const recommendations = getSmartRecommendations(preferences);
  res.json({ success: true, data: recommendations });
});

/**
 * POST /api/ai/suggestions
 * Returns quick suggestion chips for the UI
 */
router.post('/suggestions', (req, res) => {
  res.json({
    success: true,
    suggestions: [
      "Varanasi spiritual retreat",
      "Taj Mahal heritage tour",
      "Lucknow Awadhi food trail",
      "Mathura-Vrindavan weekend",
      "Prayagraj Sangam pilgrimage",
      "Buddhist circuit: Sarnath & Kushinagar"
    ]
  });
});

export default router;
