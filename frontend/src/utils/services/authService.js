import api from '../api';


// src/services/authService.js

const TOKEN_KEY = 'authToken';

/**
 * Saves the user's authentication token to localStorage.
 * @param {string} token The JWT received from the server.
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Retrieves the user's authentication token from localStorage.
 * This is the function that your userService.js needs.
 * @returns {string|null} The token, or null if not found.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Removes the user's authentication token from localStorage on logout.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials) {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },
};
