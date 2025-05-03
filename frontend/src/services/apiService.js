import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  get: (endpoint) => axiosInstance.get(endpoint),
  post: (endpoint, data) => axiosInstance.post(endpoint, data),
  put: (endpoint, data) => axiosInstance.put(endpoint, data),
  delete: (endpoint) => axiosInstance.delete(endpoint),
};
