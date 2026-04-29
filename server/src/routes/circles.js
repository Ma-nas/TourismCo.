import express from 'express';
import {
  getTravelCircles,
  getTravelCircleById,
  joinTravelCircle
} from '../services/travelService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/circles - list all travel circles
router.get('/', (req, res) => {
  const circles = getTravelCircles();
  res.json({ success: true, count: circles.length, data: circles });
});

// GET /api/circles/:id
router.get('/:id', (req, res) => {
  const circle = getTravelCircleById(req.params.id);
  if (!circle) {
    return res.status(404).json({ success: false, message: 'Travel circle not found' });
  }
  res.json({ success: true, data: circle });
});

// POST /api/circles/:id/join (protected)
router.post('/:id/join', authenticate, (req, res) => {
  const result = joinTravelCircle(req.params.id, req.user.id);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

export default router;
