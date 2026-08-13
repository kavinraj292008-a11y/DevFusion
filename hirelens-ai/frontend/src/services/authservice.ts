import api from './api';
import { User } from '../types/user';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user as User;
  },

  async register(name: string, email: string, password: string, role: 'candidate' | 'recruiter' = 'candidate'): Promise<User> {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password, role });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return user as User;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    const user = response.data.data.user;
    localStorage.setItem('user', JSON.stringify(user));
    return user as User;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
