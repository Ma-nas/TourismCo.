import express from 'express';
import { users } from '../config/dataStore.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'User already exists with this email.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password: hashed,
    verified: false,
    interests: [],
    budgetRange: { min: 5000, max: 25000, currency: 'INR' },
    joinedCircles: [],
    visitedDestinations: []
  };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, token, user: userWithoutPassword });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, token, user: userWithoutPassword });
});

export default router;
