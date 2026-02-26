import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// handle errors globally also 
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/auth')) {
      localStorage.removeItem('jwt_token');
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/auth?returnUrl=${encodeURIComponent(currentPath)}`;
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;