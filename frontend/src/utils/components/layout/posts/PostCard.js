// src/components/posts/PostCard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService'; // ✅ Import your service
import { FaHeart } from 'react-icons/fa'; // ✅ Import an icon for a better UI

const PostCard = ({ post }) => {
  // ✅ State for managing likes for each individual card
  const [isLiked, setIsLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes_count, 10));

  // ✅ Function to handle the like button click
  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id);
      // Update the state immediately for an instant UI response
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const avatarUrl =
    post.author_avatar || // This will be useful if you add avatar uploads later
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=3b82f6&color=fff&rounded=true&size=128`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Author Info */}
      <div className="flex items-start space-x-3 mb-4">
        <Link to={`/profile/${post.author_id}`}>
          <img
            src={avatarUrl}
            alt={post.author_name}
            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.author_id}`} className="font-semibold hover:underline">
            {post.author_name}
          </Link>
          <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* ✅ Updated Like button with onClick handler and dynamic styles */}
      <div className="flex items-center space-x-6 border-t pt-4 mt-4">
        <button 
          onClick={handleLike} 
          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 focus:outline-none transition-colors"
        >
          <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
          <span className="font-semibold">{likeCount}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 focus:outline-none">
          <span>💬</span>
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;