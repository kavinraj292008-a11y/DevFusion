import Notification from '../models/Notification.js';

export const createNotification = async (recipientId, type, title, message) => {
  try {
    await Notification.create({ recipient: recipientId, type, title, message });
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};