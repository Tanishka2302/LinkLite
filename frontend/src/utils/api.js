// src/api.js
import axios from 'axios';
import { getToken, removeToken } from './services/authService';

// ✅ FIX 1: Environment variable should match your .env key name
// Use REACT_APP_API_BASE_URL (React automatically exposes variables starting with REACT_APP_)
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://linklite-odit.onrender.com';

// ✅ Create Axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // helps with CORS + cookies/tokens if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor → automatically attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → handle 401/403 gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('⚠️ Authentication error. Logging out...');
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Helpful console log for debugging
console.log('🌍 Using API base URL:', `${API_BASE_URL}/api`);

export default api;
