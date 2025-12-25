import axios from 'axios';

// Create an Axios instance with base config
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry if this is already a refresh token request
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        console.error('Admin refresh token is invalid or expired. Logging out...');
        // Clear all auth data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminData');
        
        // Only redirect if not already on signin page
        if (!window.location.pathname.includes('/auth/signin')) {
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('adminRefreshToken');

      if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
        console.error('No valid admin refresh token found. Logging out...');
        // No refresh token, logout
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminData');
        
        isRefreshing = false;
        
        // Only redirect if not already on signin page
        if (!window.location.pathname.includes('/auth/signin')) {
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }

      try {
        console.log('Admin access token expired. Attempting to refresh...');
        
        // Attempt to refresh the token using the correct endpoint and payload
        // Note: Using base axios here to avoid circular dependency in interceptor
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // Handle different response structures
        const responseData = response.data.data || response.data;
        const { access_token, refresh_token: newRefreshToken } = responseData;

        if (!access_token) {
          throw new Error('No access token received from refresh endpoint');
        }

        console.log('Admin token refreshed successfully');

        // Store new tokens
        localStorage.setItem('adminToken', access_token);
        if (newRefreshToken) {
          localStorage.setItem('adminRefreshToken', newRefreshToken);
        }

        // Update the authorization header
        axiosClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process queued requests with new token
        processQueue(null, access_token);

        // Retry the original request
        return axiosClient(originalRequest);
      } catch (refreshError: any) {
        console.error('Admin token refresh failed:', refreshError.response?.data?.message || refreshError.message);
        
        // Refresh failed, logout
        processQueue(refreshError, null);
        
        // Clear all auth data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminData');
        
        // Only redirect if not already on signin page
        if (!window.location.pathname.includes('/auth/signin')) {
          window.location.href = '/auth/signin';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
export { axiosClient as apiClient };