import axios from 'axios';
import { endpoint } from '../components/LoginSignup/endpoint';

const axiosInstance = axios.create({
  baseURL: `${endpoint}`, // Adjust this to match your API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;