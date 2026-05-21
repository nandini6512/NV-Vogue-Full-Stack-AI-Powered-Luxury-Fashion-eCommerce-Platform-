import axios from 'axios';

// Instantiate the API client
const API = axios.create({
  baseURL: 'http://localhost:5000', // Points to backend directly to bypass proxy constraints during direct address binds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor injecting the user's authorization token automatically
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('nv_vogue_user_info');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
