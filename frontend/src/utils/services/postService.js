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
};
