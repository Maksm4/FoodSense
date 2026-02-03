import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://foodsense.local/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add JWT token
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
      window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;