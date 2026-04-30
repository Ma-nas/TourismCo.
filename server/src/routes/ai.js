import express from 'express';
import { runRAGPipeline } from '../services/ragPipeline.js';
import { processQuery, getTourismStats, getSmartRecommendations } from '../services/aiEngine.js';
import { getHiddenGems } from '../config/hiddenGems.js';

const router = express.Router();

// In-memory conversation history (keyed by user_id)
const conversations = new Map();

const getHistory = (userId) => conversations.get(userId) || [];
const addToHistory = (userId, role, content) => {
  const hist = getHistory(userId);
  hist.push({ role, content, timestamp: new Date().toISOString() });
  // Keep last 20 messages
  if (hist.length > 20) hist.shift();
  conversations.set(userId, hist);
};

/**
 * POST /api/ai/chat/message  — PRD §8.1 primary endpoint
 * Full RAG pipeline: User Query → Vector DB → Web Search → Gemini → Response
 */
router.post('/chat/message', async (req, res) => {
  const { user_id = 'anonymous', message = '' } = req.body;
  if (!message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  addToHistory(user_id, 'user', message);
  const history = getHistory(user_id);

  const result = await runRAGPipeline({ userQuery: message, conversationHistory: history });

  addToHistory(user_id, 'assistant', result.reply);

  res.json({
    success: true,
    user_id,
    reply: result.reply,
    itineraries: result.itineraries,
    plan: result.plan,
    links: result.links,
    constraints: result.constraints,
    suggestions: result.suggestions,
    pipeline: result.pipeline,
    aiSource: result.aiSource,
  });
});

/**
 * POST /api/ai/chat  — backward-compatible general chat endpoint
 */
router.post('/chat', async (req, res) => {
  const { message = '', user_id = 'anonymous' } = req.body;
  if (!message.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const history = getHistory(user_id);
  const result = await runRAGPipeline({ userQuery: message, conversationHistory: history });
  addToHistory(user_id, 'user', message);
  addToHistory(user_id, 'assistant', result.reply);

  res.json({
    success: true,
    message: result.reply,
    plan: result.plan,
    itineraries: result.itineraries,
    links: result.links,
    suggestions: result.suggestions,
    pipeline: result.pipeline,
  });
});

/**
 * POST /api/ai/plan
 */
router.post('/plan', async (req, res) => {
  const { message = '', destination, days, budget } = req.body;
  const query = message || `Plan a ${days || 3}-day trip to ${destination || 'Varanasi'} under ₹${budget || 15000}`;
  const result = await runRAGPipeline({ userQuery: query });
  res.json({ success: true, ...result });
});

/**
 * GET /api/ai/stats
 */
router.get('/stats', (req, res) => {
  res.json({ success: true, data: getTourismStats() });
});

/**
 * GET /api/ai/recommendations
 */
router.get('/recommendations', (req, res) => {
  const { interests = '', budget, days } = req.query;
  const preferences = {
    interests: interests ? interests.split(',') : [],
    budget: budget ? parseInt(budget) : 15000,
    days: days ? parseInt(days) : 3,
  };
  res.json({ success: true, data: getSmartRecommendations(preferences) });
});

/**
 * POST /api/ai/suggestions
 */
router.post('/suggestions', (req, res) => {
  res.json({
    success: true,
    suggestions: [
      'Plan 5 days in Varanasi under ₹15,000',
      'Taj Mahal heritage tour 2 days for couple',
      'Lucknow Awadhi food trail weekend',
      'Mathura Vrindavan spiritual trip 3 days',
      'Prayagraj Sangam pilgrimage budget trip',
      'Buddhist circuit: Sarnath & Kushinagar',
    ],
  });
});

/**
 * GET /api/ai/booking-links?destination=Varanasi  — PRD §11
 */
router.get('/booking-links', (req, res) => {
  const { destination = 'Uttar Pradesh' } = req.query;
  const enc = encodeURIComponent(destination);
  res.json({
    success: true,
    destination,
    links: {
      hotels: `https://www.booking.com/search.html?ss=${enc}`,
      flights: `https://www.skyscanner.co.in`,
      trains: `https://www.irctc.co.in/nget/train-search`,
      cabs: `https://www.uber.com/global/en/cities/`,
      activities: `https://www.tripadvisor.in/Search?q=${enc}`,
    },
  });
});

/**
 * DELETE /api/ai/history/:user_id — clear conversation history
 */
router.delete('/history/:user_id', (req, res) => {
  conversations.delete(req.params.user_id);
  res.json({ success: true, message: 'Conversation history cleared.' });
});

/**
 * GET /api/ai/hidden-gems?destination=Varanasi
 * Returns hidden places + local food for a destination
 */
router.get('/hidden-gems', (req, res) => {
  const { destination } = req.query;
  if (!destination) {
    return res.status(400).json({ success: false, message: 'destination query param required.' });
  }
  const data = getHiddenGems(destination);
  if (!data) {
    return res.status(404).json({ success: false, message: `No hidden gems data for "${destination}" yet.` });
  }
  res.json({ success: true, destination, ...data });
});

export default router;
