import express from 'express';

import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getAllApplications,
  updateApplicationStatus,
  analyzeApplication,
} from '../controllers/application.controller.js';

import {
  protect,
  authorize,
} from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Candidate
router.post(
  '/jobs/:jobId/apply',
  authorize('candidate'),
  applyForJob
);

router.get(
  '/my',
  authorize('candidate'),
  getMyApplications
);

// Recruiter / Hiring Manager / Admin
router.get(
  '/',
  authorize('recruiter', 'hiring_manager', 'admin'),
  getAllApplications
);

router.get(
  '/jobs/:jobId',
  authorize('recruiter', 'hiring_manager', 'admin'),
  getJobApplications
);

router.put(
  '/:id/status',
  authorize('recruiter', 'hiring_manager', 'admin'),
  updateApplicationStatus
);

router.post(
  '/:id/analyze',
  authorize('recruiter', 'hiring_manager', 'admin'),
  analyzeApplication
);

export default router;