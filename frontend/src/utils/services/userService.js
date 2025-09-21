// src/services/userService.js

import axios from 'axios';
import { getToken } from './authService'; // Assuming you have a function to get the token

// This is the full URL of your backend on Render.
// It's best practice to store this in a .env file.
const API_URL = 'https://linklite-odit.onrender.com';

/**
 * Fetches the logged-in user's profile and their posts.
 * This is called by your UserProfile page.
 * @returns {Promise} An axios promise containing the user and their posts.
 */
const getLoggedInUserProfile = () => {
  // We get the token, which is needed for protected routes.
  const token = getToken();
  if (!token) {
    return Promise.reject('No authentication token found');
  }

  // This is the new, correct endpoint that returns both the user and their posts.
  const url = `${API_URL}/api/users/me/details`;

  // We send the token in the 'Authorization' header so the backend knows who we are.
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// We export the function so other components can use it.
export const userService = {
  getLoggedInUserProfile,
  // ... you can add other user-related API functions here
};