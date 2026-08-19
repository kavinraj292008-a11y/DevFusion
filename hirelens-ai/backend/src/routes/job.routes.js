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
  optionalProtect,
} from '../middleware/auth.js';

const router = express.Router();

// Public job listing — optionalProtect sets req.user if JWT present,
// allowing the controller to show all statuses to recruiters/admins
// and only published jobs to guests/candidates.
router.get('/', optionalProtect, getJobs);

// Individual job — requires auth to guard draft/closed jobs
router.get('/:id', protect, getJobById);

// Recruiter/Admin only
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
