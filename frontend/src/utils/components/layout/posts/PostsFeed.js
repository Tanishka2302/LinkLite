// src/components/layout/posts/PostsFeed.js

import React, { useState, useEffect } from 'react';
import { postService } from '../../../services/postService';
import PostCard from './PostCard';
import PostCreate from './PostCreate';

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      setPosts(response.posts);
    } catch (error) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ ADDED: A more efficient function to handle new posts.
  // This function takes the new post from the child component (PostCreate)
  // and adds it to the top of the existing posts list in the state.
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    // ... your loading skeleton JSX ...
    return <div>Loading posts...</div>;
  }

  if (error) {
    // ... your error message JSX ...
    return <div>{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* ✅ UPDATED: Pass the new handler function to the PostCreate component. */}
      <PostCreate onPostCreated={handlePostCreated} />
      
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsFeed;