import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, changeRole } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);

// Self-service role change — lets a user switch between candidate and recruiter
router.put('/me/role', protect, changeRole);

export default router;
