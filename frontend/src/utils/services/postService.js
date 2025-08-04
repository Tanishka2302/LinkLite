import api from '../api';

export const postService = {
  async getAllPosts() {
    const token = localStorage.getItem('token');
    const response = await api.get('/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async createPost(content) {
    const token = localStorage.getItem('token');
    const response = await api.post('/posts', { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getUserPosts(userId) {
    const token = localStorage.getItem('token');
    const response = await api.get(`/posts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};
