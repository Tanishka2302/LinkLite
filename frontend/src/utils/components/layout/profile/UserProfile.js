/*import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../../services/userService';
import { postService } from '../../../services/postService';
import PostCard from '../posts/PostCard';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const [userResponse, postsResponse] = await Promise.all([
        userService.getUserProfile(userId),
        postService.getUserPosts(userId)
      ]);
      setUser(userResponse.user);
      setPosts(postsResponse.posts);
    } catch (error) {
      setError(error?.response?.data?.error || 'Failed to load user profile');
      console.error('Error fetching user data:', error);
    }
    
    
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-4">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
            {user.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;*/
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../../services/userService';
import { postService } from '../../../services/postService';
import PostCard from '../posts/PostCard';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const [userResponse, postsResponse] = await Promise.all([
        userService.getUserProfile(userId),
        postService.getUserPosts(userId)
      ]);
      setUser(userResponse.user);
      setPosts(postsResponse.posts);
      setError(''); // Clear any previous errors on successful fetch
    } catch (error) {
      setError(error?.response?.data?.error || 'Failed to load user profile');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // <--- Add this line
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error || 'User not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-4">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
            {user.createdAt && (
              <p className="text-sm text-gray-500 mt-2">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-center text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;