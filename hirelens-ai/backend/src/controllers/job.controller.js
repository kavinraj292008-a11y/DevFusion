import Job from '../models/Job.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Create job
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      department,
      location,
      employmentType,
      experienceLevel,
      skills,
      salaryMin,
      salaryMax,
      openings,
      status,
      applicationDeadline,
    } = req.body;

    if (!title || !description) {
      return errorResponse(
        res,
        400,
        'Title and description are required'
      );
    }

    const job = await Job.create({
      title,
      description,
      department,
      location,
      employmentType,
      experienceLevel,
      skills,
      salaryMin,
      salaryMax,
      openings,
      status,
      applicationDeadline,
      createdBy: req.user._id,
    });

    return successResponse(res, 201, 'Job created successfully', job);
  } catch (error) {
    next(error);
  }
};

// Get jobs
export const getJobs = async (req, res, next) => {
  try {
    const {
      status,
      search,
      location,
      employmentType,
      experienceLevel,
      skills,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const query = {};

    // Candidates/public users see only published jobs
    if (!req.user || req.user.role === 'candidate') {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: 'i',
      };
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (skills) {
      const skillList = skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (skillList.length > 0) {
        query.skills = {
          $in: skillList.map(
            (skill) => new RegExp(`^${skill}$`, 'i')
          ),
        };
      }
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('createdBy', 'name email role')
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 }),

      Job.countDocuments(query),
    ]);

    return successResponse(res, 200, 'Jobs retrieved successfully', {
      jobs,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    next(error);
  }
};

// Get single job
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'createdBy',
      'name email role'
    );

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (
      job.status !== 'published' &&
      (!req.user ||
        (req.user.role === 'candidate' &&
          job.createdBy?._id.toString() !== req.user._id.toString()))
    ) {
      return errorResponse(
        res,
        403,
        'Unauthorized access to unpublished job'
      );
    }

    return successResponse(
      res,
      200,
      'Job retrieved successfully',
      job
    );
  } catch (error) {
    next(error);
  }
};

// Update job
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    // Admin can update any job
    // Recruiter can update only their own job
    if (
      req.user.role !== 'admin' &&
      job.createdBy.toString() !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to update this job'
      );
    }

    const allowedFields = [
      'title',
      'description',
      'department',
      'location',
      'employmentType',
      'experienceLevel',
      'skills',
      'salaryMin',
      'salaryMax',
      'openings',
      'status',
      'applicationDeadline',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    return successResponse(
      res,
      200,
      'Job updated successfully',
      job
    );
  } catch (error) {
    next(error);
  }
};

// Delete job
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return errorResponse(res, 404, 'Job not found');
    }

    if (
      req.user.role !== 'admin' &&
      job.createdBy.toString() !== req.user._id.toString()
    ) {
      return errorResponse(
        res,
        403,
        'You are not authorized to delete this job'
      );
    }

    await job.deleteOne();

    return successResponse(
      res,
      200,
      'Job deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};