import express from 'express';

import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/job.controller.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

// Public job listing
router.get('/', getJobs);

// Individual job
router.get('/:id', protect, getJobById);

// Recruiter/Admin
router.post(
  '/',
  protect,
  authorize('recruiter', 'admin'),
  createJob
);

router.put(
  '/:id',
  protect,
  authorize('recruiter', 'admin'),
  updateJob
);

router.delete(
  '/:id',
  protect,
  authorize('recruiter', 'admin'),
  deleteJob
);

export default router;