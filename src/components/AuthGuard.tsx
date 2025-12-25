import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, validateToken, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for public routes
      if (location.pathname.startsWith('/auth/')) {
        return;
      }

      if (!isAuthenticated && !isLoading) {
        navigate('/auth/signin', { replace: true });
        return;
      }

      if (isAuthenticated && !isLoading) {
        // Validate token on route change
        const isValid = await validateToken();
        if (!isValid) {
          logout();
        }
      }
    };

    checkAuth();
  }, [location.pathname, isAuthenticated, isLoading, validateToken, logout, navigate]);

  return <>{children}</>;
};