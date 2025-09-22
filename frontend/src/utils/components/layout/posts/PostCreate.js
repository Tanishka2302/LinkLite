// src/components/posts/PostCreate.js
import React, { useState } from 'react';
import { postService } from '../../../services/postService';

const PostCreate = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      // ✅ FIX: Capture the response from the server
      const response = await postService.createPost(content);
      
      setContent('');
      
      // ✅ FIX: Pass the new post object from the response up to the parent
      onPostCreated(response.post);

    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Create a Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Share your professional thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">{content.length}/500</span>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreate;