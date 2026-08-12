import Notification from '../models/Notification.js';

import {
  successResponse,
  errorResponse,
} from '../utils/response.js';

// Get current user's notifications
export const getNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(
      res,
      200,
      'Notifications retrieved successfully',
      notifications
    );
  } catch (error) {
    next(error);
  }
};

// Mark own notification as read
export const markRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          recipient: req.user._id,
        },
        {
          read: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return errorResponse(
        res,
        404,
        'Notification not found'
      );
    }

    return successResponse(
      res,
      200,
      'Notification marked as read',
      notification
    );
  } catch (error) {
    next(error);
  }
};