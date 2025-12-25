import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/queries/client';
import { clearAuthData, getStoredAuthData, isTokenExpired } from '@/utils/auth';

interface User {
  id: string;
  email: string;
  type: "admin" | "hr";
}

interface Employee {
  id: string;
  idd: string;
  user_id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  doj: string;
  doe: string | null;
  status: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  company: {
    id: string;
    idd: string;
    name: string;
    type: string;
    description: string;
    city: string;
    state: string;
    country: string;
    status: string;
  };
  details: {
    id: string;
    employee_id: string;
    job_title: string;
    designation: string;
    department_id: string;
    team_id: string;
    department: {
      id: string;
      name: string;
      code: string;
    };
    team: {
      id: string;
      name: string;
      code: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  employee: Employee | null;
  companyId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authResponse: { access_token: string; refresh_token: string; user: User; employee: Employee }) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  validateToken: () => Promise<boolean>;
  validateTokenOnVisit: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validate current token - simplified version
  const validateToken = async () => {
    try {
      const currentToken = token || localStorage.getItem('adminToken');
      if (!currentToken) {
        return false;
      }

      // Just check if token is expired client-side first
      if (isTokenExpired(currentToken)) {
        return false;
      }

      return true;
    } catch (error: any) {
      return false;
    }
  };

  // Validate token on dashboard visit - more thorough check
  const validateTokenOnVisit = async (): Promise<boolean> => {
    try {
      const currentToken = token || localStorage.getItem('adminToken');
      const refreshTokenValue = localStorage.getItem('adminRefreshToken');
      
      // If no token at all, logout immediately
      if (!currentToken) {
        console.log('No access token found, logging out...');
        logout();
        return false;
      }

      // If token is expired client-side, try to refresh
      if (isTokenExpired(currentToken)) {
        console.log('Token expired, attempting refresh...');
        
        if (!refreshTokenValue || refreshTokenValue === 'undefined' || refreshTokenValue === 'null') {
          console.log('No valid refresh token, logging out...');
          logout();
          return false;
        }

        const newToken = await refreshAccessToken();
        return !!newToken;
      }

      // Token appears valid
      return true;
    } catch (error: any) {
      console.error('Token validation failed:', error);
      logout();
      return false;
    }
  };

  // Refresh token function (handled by axios interceptor, but exposed for manual use)
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      
      if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
        throw new Error('No valid refresh token available');
      }

      console.log('Manually refreshing admin access token...');

      const response = await axiosClient.post(
        `/auth/refresh-token`,
        { refresh_token: refreshToken }
      );

      // Handle different response structures
      const responseData = response.data.data || response.data;
      const { access_token, refresh_token } = responseData;

      if (!access_token) {
        throw new Error('No access token received from refresh endpoint');
      }

      console.log('Admin token refreshed successfully via AuthContext');
      
      // Update tokens
      localStorage.setItem('adminToken', access_token);
      if (refresh_token) {
        localStorage.setItem('adminRefreshToken', refresh_token);
      }
      
      setToken(access_token);
      return access_token;
    } catch (error: any) {
      console.error('Admin token refresh failed in AuthContext:', error.response?.data?.message || error.message);
      
      // If refresh fails, clear everything and logout
      clearAuthData();
      setToken(null);
      setUser(null);
      setEmployee(null);
      setCompanyId(null);
      navigate('/auth/signin', { replace: true });
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = getStoredAuthData();
        
        if (!authData) {
          setIsLoading(false);
          return;
        }

        const { token: storedToken, user: storedUser, employee: storedEmployee, companyId: storedCompanyId } = authData;

        // Simply restore the session without aggressive validation
        // Let the axios interceptor handle token validation on actual API calls
        setToken(storedToken);
        setUser(storedUser);
        setEmployee(storedEmployee);
        setCompanyId(storedCompanyId);
      } catch (error) {
        clearAuthData();
        setToken(null);
        setUser(null);
        setEmployee(null);
        setCompanyId(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Periodic token validation (every 15 minutes) - less aggressive
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      // Only validate if token is client-side expired
      if (isTokenExpired(token)) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          logout();
        }
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [token]);

  const login = (authResponse: { access_token: string; refresh_token: string; user: User; employee: Employee }) => {
    const { access_token, refresh_token, user: userData, employee: employeeData } = authResponse;
    
    if (!access_token || !userData || !employeeData) {
      return;
    }
    
    try {
      const companyId = employeeData.company_id;
      
      localStorage.setItem('adminToken', access_token);
      localStorage.setItem('adminData', JSON.stringify(userData));
      localStorage.setItem('adminEmployee', JSON.stringify(employeeData));
      localStorage.setItem('adminCompanyId', companyId);
      localStorage.setItem('adminRefreshToken', refresh_token);
      
      setToken(access_token);
      setUser(userData);
      setEmployee(employeeData);
      setCompanyId(companyId);
    } catch (error) {
      console.error('Login storage error:', error);
    }
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    setEmployee(null);
    setCompanyId(null);
    navigate('/auth/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        companyId,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        refreshAccessToken,
        validateToken,
        validateTokenOnVisit,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
