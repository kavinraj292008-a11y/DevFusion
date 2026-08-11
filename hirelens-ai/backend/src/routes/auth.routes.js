import express from 'express';
import rateLimit from 'express-rate-limit';

import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Maximum 20 requests per IP
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

// Public authentication routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected route
router.get('/me', protect, getMe);

export default router;