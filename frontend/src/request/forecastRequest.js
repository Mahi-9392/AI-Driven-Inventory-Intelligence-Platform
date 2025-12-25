import axiosInstance from './axiosConfig';

export const forecastRequest = {
  generateForecast: (productId, productName, region) => {
    return axiosInstance.post('/forecasts/generate', {
      productId,
      productName,
      region,
    });
  },
  
  getForecasts: (params = {}) => {
    return axiosInstance.get('/forecasts', { params });
  },
  
  getForecastById: (id) => {
    return axiosInstance.get(`/forecasts/${id}`);
  },
};

