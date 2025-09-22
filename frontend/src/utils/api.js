// src/api.js
import axios from 'axios';
// ✅ BEST PRACTICE: Import and use your authService instead of localStorage directly
import { getToken, removeToken } from './services/authService';

// ✅ FIX: Use your live Render backend URL as the fallback, not localhost.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://linklite-odit.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor automatically attaches the token to every request.
api.interceptors.request.use(
  (config) => {
    // It now uses the centralized getToken function.
    const token = getToken(); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// This interceptor handles cases where the token is invalid or expired.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns a 401 Unauthorized or 403 Forbidden error...
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('⚠️ Authentication error. Logging out...');
      // It now uses the centralized removeToken function.
      removeToken(); 
      // And then redirects to the login page.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;