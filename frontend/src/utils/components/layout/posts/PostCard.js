// src/components/posts/PostCard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../../services/postService';
import { useAuth } from '../../../context/AuthContext'; // ✅ ADDED: Import useAuth to check for the current user
import { FaHeart, FaEdit, FaTrash } from 'react-icons/fa'; // ✅ ADDED: Edit and Delete icons
import CommentCard from './CommentCard';


// ✅ UPDATED: Accept new props for delete and update events from the parent
const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user } = useAuth(); // Get the currently logged-in user

  // State for likes and comments
  const [isLiked, setIsLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes_count, 10));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // ✅ ADDED: State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);


  // --- HANDLER FUNCTIONS ---

  const handleLike = async () => { /* ... existing like logic ... */ };
  const handleFetchComments = async () => { /* ... existing fetch comments logic ... */ };
  const handleCommentSubmit = async (e) => { /* ... existing comment submit logic ... */ };

  // ✅ ADDED: Handler for deleting a post
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(post.id);
        onPostDeleted(post.id); // Notify the parent component to remove the post
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  // ✅ ADDED: Handler for saving an edited post
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postService.updatePost(post.id, editedContent);
      onPostUpdated(response.post); // Notify the parent component of the update
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post.');
    }
  };


  const formatDate = (dateString) => { /* ... existing date format logic ... */ };
  const avatarUrl = post.author_avatar || `https://...`; // your existing avatar logic

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start space-x-3 mb-4">
        <Link to={`/profile/${post.author_id}`}>
          <img src={avatarUrl} alt={post.author_name} className="w-10 h-10 rounded-full" />
        </Link>
        <div>
          <Link to={`/profile/${post.author_id}`} className="font-semibold hover:underline">
            {post.author_name}
          </Link>
          <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
        </div>
        
        {/* ✅ ADDED: JSX for the Edit/Delete buttons (conditionally rendered) */}
        <div className="ml-auto">
          {user && user.id === post.author_id && (
            <div className="flex space-x-4">
              <button onClick={() => setIsEditing(!isEditing)} className="text-gray-500 hover:text-blue-600">
                <FaEdit />
              </button>
              <button onClick={handleDelete} className="text-gray-500 hover:text-red-600">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ UPDATED: Post content is now a conditional block for editing */}
      {!isEditing ? (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
      ) : (
        <form onSubmit={handleUpdateSubmit}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
              Save
            </button>
          </div>
        </form>
      )}

      {/* ... (keep your like/comment buttons and comment section JSX) ... */}
    </div>
  );
};

export default PostCard;