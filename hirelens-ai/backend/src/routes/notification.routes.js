import express from 'express';
import { getNotifications, markRead } from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', getNotifications);
router.put('/:id/read', markRead);

export default router;