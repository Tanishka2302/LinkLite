// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { setToken, removeToken, getToken } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// It's best practice to store this in a .env file
const API_URL = 'https://linklite-odit.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] =  useState(null);
  const [loading, setLoading] = useState(true); // Start true to handle initial check

  // This useEffect runs once on app load to check for a token and keep the user logged in.
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await userService.getLoggedInUserProfile();
          setUser(response.data.user);
        } catch (error) {
          console.error("Session token is invalid, logging out.");
          removeToken(); // Clear the invalid token from storage
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // Efficient: login gets both user and token in one API call.
  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    setToken(response.data.token); // Save token to localStorage via authService
    setUser(response.data.user);   // Set user from the same response
  };

  // Efficient: register also gets both user and token.
  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    setToken(response.data.token); // Save token to localStorage via authService
    setUser(response.data.user);   // Set user from the same response
  };

  // Logout clears user state and removes token from storage.
  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  // Don't render the app until the initial loading check is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};