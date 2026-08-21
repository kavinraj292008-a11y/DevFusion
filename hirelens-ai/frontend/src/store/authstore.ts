import { create } from 'zustand';
import { User } from '../types/user';

const API = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000/api';

// Safe localStorage helpers — won't crash in SSR
const safeGet = (key: string): string | null => {
  try { return typeof window !== 'undefined' ? localStorage.getItem(key) : null; }
  catch { return null; }
};
const safeSet = (key: string, val: string) => {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, val); } catch {}
};
const safeRemove = (key: string) => {
  try { if (typeof window !== 'undefined') localStorage.removeItem(key); } catch {}
};

const getToken  = () => safeGet('token');
const getStored = (): User | null => {
  const raw = safeGet('user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
};

async function apiPost(path: string, body: object) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data.data;
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
      const { token, user } = await apiPost('/auth/login', { email, password });
      safeSet('token', token);
      safeSet('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user as User;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await apiPost('/auth/register', { name, email, password, role });
      safeSet('token', token);
      safeSet('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user as User;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  logout: () => {
    safeRemove('token');
    safeRemove('user');
    set({ user: null, isAuthenticated: false, error: null });
  },

  initAuth: () => {
    set({ user: getStored(), isAuthenticated: !!getToken() });
  },
}));
