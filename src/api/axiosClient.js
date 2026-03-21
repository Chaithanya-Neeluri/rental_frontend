import axios from 'axios';

// Base axios instance ready to plug into Node/Express backend
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
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

