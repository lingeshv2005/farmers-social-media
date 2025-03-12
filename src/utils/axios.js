import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { toast } from 'react-toastify';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000 // 15 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add retry count to config
    config.retryCount = config.retryCount || 0;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced retry logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If we don't have a config, or we've already retried too many times, reject
    if (!originalRequest || originalRequest.retryCount >= MAX_RETRIES) {
      if (originalRequest?.retryCount >= MAX_RETRIES) {
        toast.error('Server is not responding after multiple attempts. Please try again later.');
      }
      return Promise.reject(error);
    }

    // Increment retry count
    originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;

    // Handle various error cases
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 502:
        case 503:
        case 504:
          // Server error, retry after delay
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return axiosInstance(originalRequest);

        case 401:
          // Unauthorized, clear auth and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('isAuth');
          window.location.href = '/login';
          return Promise.reject(error);

        default:
          return Promise.reject(error);
      }
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      // Network error or no response (could be CORS), retry
      if (originalRequest.retryCount === 1) {
        toast.warning('Having trouble connecting to the server. Retrying...');
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 