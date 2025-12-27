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
      let errorMessage = 'Login failed';
      let errorCode = null;
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || 'Login failed';
        errorCode = error.response.data?.code || null;
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
      let errorMessage = 'Signup failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || 'Signup failed';
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else {
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
      const response = await authRequest.getGoogleAuthUrl();
      const { authUrl } = response.data;
      
      window.location.replace(authUrl);
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Failed to initiate Google sign-in';
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
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

