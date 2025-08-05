import api from '../../api'; // ⬅️ Go up two levels


export const userService = {
  async getUserProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};
