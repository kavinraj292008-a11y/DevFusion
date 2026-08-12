import express from 'express';

import {
  scheduleInterview,
  getMyInterviews,
} from '../controllers/interview.controller.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/my', getMyInterviews);

router.post(
  '/',
  authorize('recruiter', 'hiring_manager', 'admin'),
  scheduleInterview
);

export default router;