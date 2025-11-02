import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../../services/postService';
import { useAuth } from '../../../context/AuthContext';
import { FaHeart, FaEdit, FaTrash } from 'react-icons/fa';
import CommentCard from './CommentCard';

const PostCard = ({ post, onPostDeleted, onPostUpdated }) => {
  const { user } = useAuth();

  const [isLiked, setIsLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes_count, 10));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  // --- HANDLERS ---

  const handleLike = async () => {
    try {
      const response = await postService.toggleLike(post.id);
      setIsLiked(response.has_liked);
      setLikeCount(response.likes_count);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(post.id);
        onPostDeleted(post.id);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postService.updatePost(post.id, editedContent);
      onPostUpdated(response.post);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const avatarUrl =
    post.author_avatar ||
    'https://ui-avatars.com/api/?name=' + encodeURIComponent(post.author_name);

  // --- RENDER ---

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {/* Header: Avatar + Name + Date */}
      <div className="flex items-start space-x-3 mb-4">
        <Link to={`/profile/${post.author_id}`}>
          <img
            src={avatarUrl}
            alt={post.author_name}
            className="w-10 h-10 rounded-full"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${post.author_id}`}
            className="font-semibold hover:underline"
          >
            {post.author_name}
          </Link>
          <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
        </div>

        {/* Edit/Delete (if author) */}
        {user && user.id === post.author_id && (
          <div className="ml-auto flex space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-blue-600"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {/* Editable content */}
      {!isEditing ? (
        <>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* ✅ SHOW IMAGE OR VIDEO IF AVAILABLE */}
          {post.media_url && (
            <div className="mb-4">
              {post.media_url.endsWith('.mp4') ||
              post.media_url.endsWith('.mov') ||
              post.media_url.endsWith('.webm') ? (
                <video
                  src={post.media_url}
                  controls
                  className="w-full rounded-lg border"
                />
              ) : (
                <img
                  src={post.media_url}
                  alt="Post media"
                  className="w-full rounded-lg border"
                />
              )}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleUpdateSubmit}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="3"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Like + Comment buttons (same as before) */}
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 ${
            isLiked ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          <FaHeart />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500"
        >
          💬 Comments
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c) => <CommentCard key={c.id} comment={c} />)
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
