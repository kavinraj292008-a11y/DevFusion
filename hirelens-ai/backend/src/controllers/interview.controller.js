import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

import { createNotification } from '../services/notification.service.js';

import {
  successResponse,
  errorResponse,
} from '../utils/response.js';

// Schedule interview
export const scheduleInterview = async (
  req,
  res,
  next
) => {
  try {
    const {
      application,
      interviewer,
      scheduledAt,
      duration,
      meetingLink,
      notes,
    } = req.body;

    if (
      !application ||
      !interviewer ||
      !scheduledAt ||
      !duration
    ) {
      return errorResponse(
        res,
        400,
        'Application, interviewer, scheduledAt and duration are required'
      );
    }

    const applicationData = await Application.findById(
      application
    ).populate('job', 'title createdBy');

    if (!applicationData) {
      return errorResponse(
        res,
        404,
        'Application not found'
      );
    }

    // Only job owner or admin can schedule
    if (
      req.user.role !== 'admin' &&
      applicationData.job.createdBy.toString() !==
        req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to schedule this interview'
      );
    }

    const interviewerUser = await User.findById(
      interviewer
    );

    if (!interviewerUser) {
      return errorResponse(
        res,
        404,
        'Interviewer not found'
      );
    }

    if (
      !['interviewer', 'hiring_manager', 'recruiter', 'admin'].includes(
        interviewerUser.role
      )
    ) {
      return errorResponse(
        res,
        400,
        'Selected user cannot conduct interviews'
      );
    }

    const interview = await Interview.create({
      application,
      candidate: applicationData.candidate,
      interviewer,
      scheduledAt,
      duration,
      meetingLink,
      notes,
    });

    // Move application to interview stage
    applicationData.status = 'interview';
    await applicationData.save();

    await createNotification(
      applicationData.candidate,
      'interview_scheduled',
      'Interview Scheduled',
      `An interview has been scheduled for ${applicationData.job.title}.`
    );

    await createNotification(
      interviewer,
      'interview_scheduled',
      'Interview Assigned',
      `You have been assigned an interview for ${applicationData.job.title}.`
    );

    return successResponse(
      res,
      201,
      'Interview scheduled successfully',
      interview
    );
  } catch (error) {
    next(error);
  }
};

// Get current user's interviews
export const getMyInterviews = async (
  req,
  res,
  next
) => {
  try {
    let query;

    if (req.user.role === 'candidate') {
      query = {
        candidate: req.user._id,
      };
    } else {
      query = {
        interviewer: req.user._id,
      };
    }

    const interviews = await Interview.find(query)
      .populate(
        'application',
        'status aiScore'
      )
      .populate(
        'candidate',
        'name email'
      )
      .populate(
        'interviewer',
        'name email role'
      )
      .sort({ scheduledAt: 1 });

    return successResponse(
      res,
      200,
      'Interviews retrieved successfully',
      interviews
    );
  } catch (error) {
    next(error);
  }
};