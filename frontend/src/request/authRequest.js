import axiosInstance from './axiosConfig';

export const authRequest = {
  signup: (name, email, password) => {
    return axiosInstance.post('/auth/signup', { name, email, password });
  },
  
  login: (email, password) => {
    return axiosInstance.post('/auth/login', { email, password });
  },

  getGoogleAuthUrl: () => {
    return axiosInstance.get('/auth/google/url');
  },
};

