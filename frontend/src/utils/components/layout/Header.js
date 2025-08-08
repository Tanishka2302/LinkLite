import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LinkLite
        </Link>
        
        {user && (
          <nav className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Feed
            </Link>

            {/*
            <Link 
              to={`/profile/${user.id}`} 
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Profile
            </Link>
            */}

            <button
              onClick={handleLogout}
              className="px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
