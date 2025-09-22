// src/services/userService.js

// ✅ Import the central 'api' instance instead of 'axios'
import api from '../api';

const getLoggedInUserProfile = () => {
  // ✅ The code is much simpler now.
  // The 'api' instance automatically adds the base URL, token, and headers.
  return api.get('/users/me/details');
};

export const userService = {
  getLoggedInUserProfile,
  // ... you can add other user-related API functions here
};