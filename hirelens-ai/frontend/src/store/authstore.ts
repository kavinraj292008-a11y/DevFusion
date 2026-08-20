import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types/user';

const API = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000/api';

const getToken  = () => localStorage.getItem('token');
const getStored = (): User | null => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

async function apiLogin(email: string, password: string) {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data.data;
}
async function apiRegister(name: string, email: string, password: string, role: string) {
  const res = await axios.post(`${API}/auth/register`, { name, email, password, role });
  return res.data.data;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: 'candidate' | 'recruiter') => Promise<User>;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStored(),
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user as User;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiRegister(name, email, password, role);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user as User;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, error: null });
  },

  initAuth: () => {
    set({ user: getStored(), isAuthenticated: !!getToken() });
  },
}));
