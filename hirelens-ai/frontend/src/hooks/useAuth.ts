import { useAuthStore } from '../store/authstore';

export const useAuth = () => {
    useAuthStore();
  const { user, isAuthenticated, isLoading, error, login, logout, register } = useAuthStore();
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
