import api from './api';

// Serviço de usuários (operações de escrita restritas a admin no backend).
export const userService = {
  async getAll() {
    const { data } = await api.get('/users');
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/users', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/users/${id}`);
  }
};

export default userService;
