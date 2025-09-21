// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { setToken, removeToken, getToken } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'https://linklite-odit.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true to handle initial check
  const [authError, setAuthError] = useState(null);

  // ✅ This useEffect runs once on app load to check for a token and keep the user logged in.
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = getToken();
      if (token) {
        try {
          // We use the getLoggedInUserProfile because it returns both user and posts
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

  // ✅ More efficient: login returns both user and token in one call.
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setToken(response.data.token); // Save token to localStorage
      setUser(response.data.user); // Set user from the same response
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setAuthError(errorMsg);
      console.error('Login Error:', err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ More efficient: register also returns both user and token.
  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      setToken(response.data.token); // Save token to localStorage
      setUser(response.data.user); // Set user from the same response
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setAuthError(errorMsg);
      console.error('Register Error:', err);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout clears user state and removes token from storage.
  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    authError,
    login,
    register,
    logout,
  };

  // Don't render the app until the initial loading check is complete
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};