import { useAuthStore } from '../store/authstore';

export const useAuth = () => {
<<<<<<< HEAD
  const { user, isAuthenticated, isLoading, error, login, logout, register } =
    useAuthStore();
=======
  const { user, isAuthenticated, isLoading, error, login, logout, register } = useAuthStore();
>>>>>>> 686f28bef71fa6733e6794efa6a1ca99ae89973a
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    isRecruiter: user?.role === 'recruiter',
<<<<<<< HEAD
    isCandidate:  user?.role === 'candidate',
=======
    isCandidate: user?.role === 'candidate',
>>>>>>> 686f28bef71fa6733e6794efa6a1ca99ae89973a
  };
};
