import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/context/AuthContext';
import Header from './utils/components/layout/Header';
import LoginForm from './utils/components/auth/LoginForm';
import RegisterForm from './utils/components/auth/RegisterForm';
import PostsFeed from './utils/components/layout/posts/PostsFeed';
import UserProfile from './utils/components/layout/profile/UserProfile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Header />
                  <main className="max-w-4xl mx-auto px-4 py-8">
                    <PostsFeed />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Header />
                  <main className="max-w-4xl mx-auto px-4 py-8">
                    <UserProfile />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;