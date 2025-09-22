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

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchPosts} className="mt-4 text-blue-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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