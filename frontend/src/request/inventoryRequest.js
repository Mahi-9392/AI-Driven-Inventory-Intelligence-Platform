import axiosInstance from './axiosConfig';

export const inventoryRequest = {
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('csv', file);
    return axiosInstance.post('/inventory/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getInventoryData: (params = {}) => {
    return axiosInstance.get('/inventory/data', { params });
  },
  
  getProducts: () => {
    return axiosInstance.get('/inventory/products');
  },
};

