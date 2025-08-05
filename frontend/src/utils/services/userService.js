import api from '../../api';

export const userService = {
  async getLoggedInUserProfile() {
    const response = await api.get('/users/me');
    return response.data;
  },
};
