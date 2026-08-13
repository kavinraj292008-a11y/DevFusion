import { create } from 'zustand';
import { User, UserRole } from '../types/user';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'rec-1',
    name: 'Sarah Jenkins',
    email: 'sarah@hirelens.ai',
    role: 'recruiter',
  },
  isAuthenticated: true,
  isLoading: false,
  login: async (email, role) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(email, role);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));