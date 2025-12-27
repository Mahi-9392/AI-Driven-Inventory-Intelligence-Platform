import React, { createContext, useContext, useState, useEffect } from 'react';
import { authRequest } from '../request/authRequest';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        }
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authRequest.login(email, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error response:', error.response?.data);
      let errorMessage = 'Login failed';
      let errorCode = null;
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || 'Login failed';
        errorCode = error.response.data?.code || null;
        console.log('Error code from backend:', errorCode);
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        errorMessage = error.message || 'Login failed';
      }
      
      return { 
        success: false, 
        message: errorMessage,
        code: errorCode,
        status: error.response?.status // Include status code for better detection
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await authRequest.signup(name, email, password);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || 'Signup failed';
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Signup failed';
      }
      
      return { 
        success: false, 
        message: errorMessage,
        code: error.response?.data?.code
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('🔵 Initiating Google OAuth...');
      console.log('🔵 API Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
      
      // Get the auth URL from backend
      const response = await authRequest.getGoogleAuthUrl();
      const { authUrl } = response.data;
      
      console.log('✅ Google OAuth URL received, redirecting...');
      
      // Immediately redirect - don't wait for anything else
      // Use window.location.replace to avoid issues with back button
      window.location.replace(authUrl);
      
      // Return success immediately - page is redirecting
      return { success: true };
    } catch (error) {
      console.error('❌ Google OAuth initiation error:', error);
      
      // Only return error if it's a server error (not network/timeout)
      // Network errors might be transient, so provide a clearer message
      let errorMessage = 'Failed to initiate Google sign-in';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Request was made but no response received - likely network issue or timeout
        errorMessage = 'Connection timeout. Please try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return { 
        success: false, 
        message: errorMessage,
        code: error.response?.data?.code
      };
    }
  };

  const handleGoogleCallback = (token, email, name, id) => {
    try {
      setToken(token);
      const userData = {
        id: id || '',
        email,
        name
      };
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error('Google callback handling error:', error);
      return { 
        success: false, 
        message: 'Failed to complete Google sign-in'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, loginWithGoogle, handleGoogleCallback }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

