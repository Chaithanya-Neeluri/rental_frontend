import axios from 'axios';

// Base axios instance ready to plug into Node/Express backend
const defaultApiBaseUrl =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : 'https://rental-backend-a9if.onrender.com';

export const axiosClient = axios.create({
  // Allow override via `VITE_API_BASE_URL`, but default to the deployed backend.
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
  withCredentials: true,
  timeout: 15000,
});

axiosClient.interceptors.request.use(
  (config) => {
    // Attach JWT from storage when backend is ready
    const token = localStorage.getItem('hrpf_token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 / token expiry hooks here later
    return Promise.reject(error);
  },
);

