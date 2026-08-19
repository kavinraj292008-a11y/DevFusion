import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Name, email and password are required');
    }

    // Only allow candidate or recruiter from public registration
    const allowedRoles = ['candidate', 'recruiter'];
    const assignedRole = allowedRoles.includes(role) ? role : 'candidate';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }

    const user = await User.create({ name, email, password, role: assignedRole });
    const token = generateToken(user._id);

    return successResponse(res, 201, 'Registered successfully', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = generateToken(user._id);

    return successResponse(res, 200, 'Login successful', {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'User retrieved successfully', {
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/me/role
// Allows a logged-in user to switch their own role between candidate and recruiter
export const changeRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['candidate', 'recruiter'];

    if (!allowedRoles.includes(role)) {
      return errorResponse(res, 400, `Role must be one of: ${allowedRoles.join(', ')}`);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role },
      { new: true }
    );

    // Reissue token with same id (role is fetched from DB each request anyway)
    const token = generateToken(user._id);

    // Update stored user
    localStorage?.setItem?.('user', JSON.stringify(user)); // no-op server-side, for clarity

    return successResponse(res, 200, `Role updated to ${role}`, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
