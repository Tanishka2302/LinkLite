import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API = process.env.REACT_APP_API_URL || 'https://linklite-odit.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token/user with localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
  }, [user, token]);

  // ----------------------
  // Register
  // ----------------------
  const register = async (name, email, password, bio = '', avatar = '') => {
    setLoading(true);
    setAuthError(null);
    try {
      const avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&rounded=true&size=128`;

      const res = await axios.post(`${API}/auth/register`, {
        name,
        email,
        password,
        bio,
        avatar: avatarUrl,
      });

      setToken(res.data.token);

      // Fetch user profile after registration
      const profileRes = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      setUser(profileRes.data);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Registration failed');
      console.error('Register Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Login
  // ----------------------
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });

      setToken(res.data.token);

      // Fetch logged-in user's profile
      const profileRes = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      setUser(profileRes.data);
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Login failed');
      console.error('Login Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Logout
  // ----------------------
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
