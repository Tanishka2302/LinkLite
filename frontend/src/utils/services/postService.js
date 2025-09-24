// src/services/postService.js
import api from '../api';

export const postService = {
  async getAllPosts() {
    const response = await api.get('/posts');
    return response.data;
  },

  async createPost(content) {
    const response = await api.post('/posts', { content });
    return response.data;
  },

  async getUserPosts(userId) {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },
  
  async toggleLike(postId) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // ✅ ADD THIS: Get all comments for a specific post
  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // ✅ ADD THIS: Create a new comment on a post
  async createComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },
   // ✅ ADD THIS: Delete a post
   async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
   }
};