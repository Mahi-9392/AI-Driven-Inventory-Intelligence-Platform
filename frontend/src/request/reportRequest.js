import axiosInstance from './axiosConfig';

export const reportRequest = {
  generatePDF: (params = {}) => {
    return axiosInstance.get('/reports/pdf', {
      params,
      responseType: 'blob',
    });
  },
};

