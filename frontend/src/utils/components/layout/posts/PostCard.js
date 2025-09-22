import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../../services/postService';
import { FaHeart } from 'react-icons/fa';
import CommentCard from './CommentCard';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.has_liked);
  const [likeCount, setLikeCount] = useState(parseInt(post.likes_count, 10));
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    try {
      await postService.toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleFetchComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    try {
      const fetchedComments = await postService.getComments(post.id);
      setComments(fetchedComments);
      setShowComments(true);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const createdComment = await postService.createComment(post.id, newComment);
      setComments([createdComment, ...comments]);
      setNewComment('');
    } catch (error)
      console.error('Failed to create comment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const avatarUrl =
    post.author_avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      post.author_name
    )}&background=3b82f6&color=fff&rounded=true&size=128`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start space-x-3 mb-4">
        <Link to={`/profile/${post.author_id}`}>
          <img
            src={avatarUrl}
            alt={post.author_name}
            className="w-10 h-10 rounded-full"
          />
        </Link>
        <div>
          <Link to={`/profile/${post.author_id}`} className="font-semibold hover:underline">
            {post.author_name}
          </Link>
          <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center space-x-6 border-t pt-4 mt-4">
        <button onClick={handleLike} className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
          <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-400'} />
          <span className="font-semibold">{likeCount}</span>
        </button>
        <button onClick={handleFetchComments} className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
          <span>💬</span>
          <span>{showComments ? 'Hide Comments' : `${comments.length} Comments`}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Post
            </button>
          </form>
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;