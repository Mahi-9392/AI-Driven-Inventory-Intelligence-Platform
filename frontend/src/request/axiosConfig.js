import axios from 'axios';

// Use relative URL to leverage Vite proxy, or full URL if VITE_API_BASE_URL is set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Debug: Log API base URL (always log in browser for debugging)
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 VITE_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL);

// Make API_BASE_URL available globally for debugging in browser console
if (typeof window !== 'undefined') {
  window.__API_BASE_URL__ = API_BASE_URL;
  window.__VITE_API_BASE_URL__ = import.meta.env.VITE_API_BASE_URL;
  console.log('💡 To check API URL in console, type: window.__API_BASE_URL__');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

