// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/context/AuthContext';
import Header from './utils/components/layout/Header';
import LoginForm from './utils/components/auth/LoginForm';
import RegisterForm from './utils/components/auth/RegisterForm';
import PostsFeed from './utils/components/layout/posts/PostsFeed';
import UserProfile from './utils/components/layout/profile/UserProfile';

// Your ProtectedRoute component is perfect and doesn't need any changes.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// This is the main App component with the improved structure.
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* ✅ The Header is now outside the Routes, so it's always visible */}
          <Header />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              
              {/* --- Protected Routes --- */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PostsFeed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* --- Catch-all Route --- */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;