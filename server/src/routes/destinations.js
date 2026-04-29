import express from 'express';
import {
  getDestinations,
  getDestinationById,
  getSmartMatches,
  searchDestinations
} from '../services/travelService.js';

const router = express.Router();

// GET /api/destinations - list all UP destinations
router.get('/', (req, res) => {
  const destinations = getDestinations();
  res.json({ success: true, count: destinations.length, data: destinations });
});

// GET /api/destinations/search?q=varanasi
router.get('/search', (req, res) => {
  const { q = '' } = req.query;
  const results = searchDestinations(q);
  res.json({ success: true, count: results.length, data: results });
});

// GET /api/destinations/matches?interests=Photography,Heritage&budget=15000
router.get('/matches', (req, res) => {
  const { interests = '', budget } = req.query;
  const preferences = {
    interests: interests ? interests.split(',') : [],
    budget: budget ? parseInt(budget) : null
  };
  const matches = getSmartMatches(preferences);
  res.json({ success: true, data: matches });
});

// GET /api/destinations/:id
router.get('/:id', (req, res) => {
  const destination = getDestinationById(req.params.id);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }
  res.json({ success: true, data: destination });
});

export default router;
