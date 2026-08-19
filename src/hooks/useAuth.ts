import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, register } =
    useAuthStore();
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    isRecruiter: user?.role === 'recruiter',
    isCandidate:  user?.role === 'candidate',
  };
};
