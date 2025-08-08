import api from '../api';

export const userService = {
  // ❌ Remove the userId param — you don’t need it
  async getUserProfile() {
    const response = await api.get('/users/me'); // ✅ hit /users/me
    return response.data;
  },
};
