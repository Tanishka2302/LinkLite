// src/components/posts/PostCard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../../services/postService';
import { FaHeart } from 'react-icons/fa';
import CommentCard from './CommentCard'; // ✅ ADDED: Import the CommentCard component

const PostCard = ({ post }) => {
  // State for managing likes
  const [isLiked, setIsLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes_count, 10));

  // ✅ ADDED: State for managing comments
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Function to handle the like button click
  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // ✅ ADDED: Function to fetch comments for this post
  const handleFetchComments = async () => {
    // If comments are already shown, just hide them.
    if (showComments) {
      setShowComments(false);
      return;
    }
    try {
      // Otherwise, fetch the comments from the API
      const fetchedComments = await postService.getComments(post.id);
      setComments(fetchedComments);
      setShowComments(true); // Then show the comment section
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // ✅ ADDED: Function to handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Don't submit empty comments
    try {
      const createdComment = await postService.createComment(post.id, newComment);
      // Add the new comment to the list for an instant UI update
      setComments([createdComment, ...comments]);
      setNewComment(''); // Clear the input box
    } catch (error) {
      console.error('Failed to create comment:', error);
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
    post.author_avatar || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=3b82f6&color=fff&rounded=true&size=128`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Author Info */}
      <div className="flex items-start space-x-3 mb-4">
        {/* ... your existing author JSX ... */}
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Action Buttons */}
      <div className="flex items-center space-x-6 border-t pt-4 mt-4">
        <button 
          onClick={handleLike} 
          className="flex items-center space-x-2 text-gray-600 hover:text-red-500 focus:outline-none transition-colors"
        >
          <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
          <span className="font-semibold">{likeCount}</span>
        </button>
        {/* ✅ UPDATED: The comment button now toggles the comment section */}
        <button 
          onClick={handleFetchComments} 
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 focus:outline-none"
        >
          <span>💬</span>
          <span>{showComments ? 'Hide Comments' : `${comments.length} Comments`}</span>
        </button>
      </div>

      {/* ✅ ADDED: The entire comment section with form and list */}
      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-2 mb-4">
          <input
  type="text"
  value={newComment}
  onChange={(e) => setNewComment(e.target.value)} // ✅ Make sure it says e.target.value
  placeholder="Write a comment..."
  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Post
            </button>
          </form>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;