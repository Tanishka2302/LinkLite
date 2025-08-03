// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = 'https://linklite-odit.onrender.com/api/auth';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Save to localStorage on change
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
  }, [user, token]);

  const register = async (name, email, password, bio, avatar = '') => {
    setLoading(true);
    setAuthError(null);
    try {
      const avatarUrl = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

      const res = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        bio,
        avatar: avatarUrl,
      });

      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Registration failed');
      console.error('Register Error:', err);
      throw err; // optional: allows UI to display toast/snackbar
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post(`${API}/login`, { email, password });

      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Login failed');
      console.error('Login Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
