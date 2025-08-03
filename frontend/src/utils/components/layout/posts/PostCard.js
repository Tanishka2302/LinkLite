import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3 mb-4">
        <Link to={`/profile/${post.authorId}`}>
          <img
            src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}&background=3b82f6&color=fff`}
            alt={post.authorName}
            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.authorId}`} className="font-semibold hover:underline">
            {post.authorName}
          </Link>
          <p className="text-sm text-gray-500">{formatDate(post.timestamp)}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{post.content}</p>
      
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
          <span>❤️</span>
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
          <span>��</span>
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;