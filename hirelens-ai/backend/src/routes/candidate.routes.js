import express from 'express';
import { getMyProfile, updateMyProfile, uploadResume } from '../controllers/candidate.controller.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);
router.get('/me', authorize('candidate'), getMyProfile);
router.put('/me', authorize('candidate'), updateMyProfile);
router.post('/me/resume', authorize('candidate'), upload.single('resume'), uploadResume);

export default router;