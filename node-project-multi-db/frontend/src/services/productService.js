import api from './api';

// Serviço de produtos (recurso protegido no backend).
export const productService = {
  async getAll() {
    const { data } = await api.get('/products');
    return data;
  },
  async create(payload) {
    const { data } = await api.post('/products', payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/products/${id}`);
  }
};

export default productService;
