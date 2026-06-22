import api from './api';

// Serviço de autenticação: encapsula as rotas /auth do backend.
export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { token, user }
  },
  async register({ name, email, password }) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data; // { token, user }
  },
  async me() {
    const { data } = await api.get('/auth/me');
    return data.user;
  }
};

export default authService;
