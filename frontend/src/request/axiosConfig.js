import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout (increased for OAuth URL request)
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not on the login/signup page and have a token
      // Don't redirect during login attempts (no token yet)
      const token = localStorage.getItem('token');
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
      
      if (token && !isAuthPage) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // If no token or on auth page, let the error pass through for proper handling
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

