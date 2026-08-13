import { delay } from './api';
import { User, UserRole } from '../types/user';

export const authService = {
  async login(email: string, role: UserRole): Promise<User> {
    await delay(500);
    return {
      id: role === 'recruiter' ? 'rec-1' : 'cand-1',
      name: role === 'recruiter' ? 'Sarah Jenkins' : 'Alex Rivera',
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    };
  },
};