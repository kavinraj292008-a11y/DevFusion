import CandidateProfile from '../models/CandidateProfile.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getMyProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      profile = await CandidateProfile.create({
        user: req.user._id,
      });
    }

    return successResponse(
      res,
      200,
      'Profile retrieved successfully',
      profile
    );
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'phone',
      'location',
      'headline',
      'bio',
      'skills',
      'experience',
      'education',
      'linkedinUrl',
      'githubUrl',
      'portfolioUrl',
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const profile = await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return successResponse(
      res,
      200,
      'Profile updated successfully',
      profile
    );
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        400,
        'No resume file uploaded'
      );
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const profile = await CandidateProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          resumeUrl,
          resumeOriginalName: req.file.originalname,
          resumeUploadedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return successResponse(
      res,
      200,
      'Resume uploaded successfully',
      {
        resumeUrl,
        originalName: req.file.originalname,
        uploadedAt: profile.resumeUploadedAt,
      }
    );
  } catch (error) {
    next(error);
  }
};