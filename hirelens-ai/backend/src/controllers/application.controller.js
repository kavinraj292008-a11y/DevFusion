import Application from '../models/Application.js';
import Job from '../models/Job.js';
import CandidateProfile from '../models/CandidateProfile.js';

import { analyzeResume } from '../services/ai.service.js';
import { createNotification } from '../services/notification.service.js';

import {
  successResponse,
  errorResponse,
} from '../utils/response.js';

// Candidate applies for a job
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job || job.status !== 'published') {
      return errorResponse(
        res,
        404,
        'Job not found or not open'
      );
    }

    if (
      job.applicationDeadline &&
      new Date() > new Date(job.applicationDeadline)
    ) {
      return errorResponse(
        res,
        400,
        'Application deadline has passed'
      );
    }

    const profile = await CandidateProfile.findOne({
      user: req.user._id,
    });

    if (!profile || !profile.resumeUrl) {
      return errorResponse(
        res,
        400,
        'Please upload a resume to your profile first'
      );
    }

    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      resumeUrl: profile.resumeUrl,
      coverLetter: req.body.coverLetter,
    });

    await createNotification(
      req.user._id,
      'application_submitted',
      'Application Received',
      `You successfully applied for ${job.title}.`
    );

    return successResponse(
      res,
      201,
      'Applied successfully',
      application
    );
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(
        res,
        400,
        'You have already applied to this job'
      );
    }

    next(error);
  }
};

// Candidate's applications
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate(
        'job',
        'title location status employmentType'
      )
      .sort({ createdAt: -1 });

    return successResponse(
      res,
      200,
      'Applications retrieved successfully',
      applications
    );
  } catch (error) {
    next(error);
  }
};

// Recruiter gets applications for their own job
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    // Admin can access any job.
    // Recruiter/hiring manager must own the job.
    if (
      req.user.role !== 'admin' &&
      job.createdBy.toString() !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to view these applications'
      );
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate('candidate', 'name email')
      .sort({ aiScore: -1, createdAt: -1 });

    return successResponse(
      res,
      200,
      'Applications retrieved successfully',
      applications
    );
  } catch (error) {
    next(error);
  }
};

// Update application status
export const updateApplicationStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'applied',
      'screening',
      'shortlisted',
      'interview',
      'selected',
      'rejected',
      'withdrawn',
    ];

    if (!allowedStatuses.includes(status)) {
      return errorResponse(
        res,
        400,
        `Invalid application status. Allowed values: ${allowedStatuses.join(', ')}`
      );
    }

    const application = await Application.findById(
      req.params.id
    ).populate('job', 'title createdBy');

    if (!application) {
      return errorResponse(
        res,
        404,
        'Application not found'
      );
    }

    const job = application.job;

    if (
      req.user.role !== 'admin' &&
      job.createdBy.toString() !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to update this application'
      );
    }

    application.status = status;

    if (status === 'shortlisted') {
      application.shortlistedAt = new Date();
    }

    if (status === 'rejected') {
      application.rejectedAt = new Date();
    }

    await application.save();

    await createNotification(
      application.candidate,
      'status_update',
      'Application Update',
      `Your application for ${job.title} is now ${status}.`
    );

    return successResponse(
      res,
      200,
      'Application status updated successfully',
      application
    );
  } catch (error) {
    next(error);
  }
};

// AI analysis
export const analyzeApplication = async (
  req,
  res,
  next
) => {
  try {
    const application = await Application.findById(
      req.params.id
    )
      .populate('job')
      .populate('candidate');

    if (!application) {
      return errorResponse(
        res,
        404,
        'Application not found'
      );
    }

    if (
      req.user.role !== 'admin' &&
      application.job.createdBy.toString() !==
        req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to analyze this application'
      );
    }

    const profile = await CandidateProfile.findOne({
      user: application.candidate._id,
    });

    if (!profile) {
      return errorResponse(
        res,
        404,
        'Candidate profile not found'
      );
    }

    const analysis = await analyzeResume(
      profile,
      application.job
    );

    application.aiScore = analysis.score;
    application.aiSummary = analysis;

    await application.save();

    return successResponse(
      res,
      200,
      'AI analysis completed',
      application
    );
  } catch (error) {
    next(error);
  }
};