// src/services/postService.js
import api from '../api';

export const postService = {
  // 🟢 Get all posts
  async getAllPosts() {
    const response = await api.get('/posts');
    return response.data;
  },

  // 🟢 Create a new post
  async createPost(content) {
    const response = await api.post('/posts', { content });
    return response.data;
  },

  // 🟢 Get posts for a specific user
  async getUserPosts(userId) {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },

  // 🟢 Like/unlike a post
  async toggleLike(postId) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // 🟢 Get all comments for a post
  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // 🟢 Create a comment on a post
  async createComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // 🟢 Delete a post
  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // 🆕 🟢 Update a post (FIX for your current error)

  // ✅ FIXED updatePost
async updatePost(postId, content) {
  const response = await api.put(`/posts/${postId}`, { content }); // <-- must be an object
  return response.data;
}

};
