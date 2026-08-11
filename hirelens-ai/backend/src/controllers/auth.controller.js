import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Public registration always creates a candidate
    const role = 'candidate';

    if (!name || !email || !password) {
      return errorResponse(
        res,
        400,
        'Name, email and password are required'
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(
        res,
        400,
        'Email already exists'
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      201,
      'Registered successfully',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        'Please provide email and password'
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(
        res,
        401,
        'Invalid credentials'
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        'Invalid credentials'
      );
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      200,
      'Login successful',
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    return successResponse(
      res,
      200,
      'User retrieved successfully',
      {
        user: req.user,
      }
    );
  } catch (error) {
    next(error);
  }
};