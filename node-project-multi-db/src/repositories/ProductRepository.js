import Product from '../models/ProductModel.js';

export class ProductRepository {
  async create(data) {
      return await Product.create(data);
  }

  async findAll() {
      return await Product.findAll();
  }

  async findById(id) {
      return await Product.findByPk(id);
  }

  async update(id, data) {
    const item = await Product.findByPk(id);
    return item ? await item.update(data) : null;
  }

  async delete(id) {
    const item = await Product.findByPk(id);
    return item ? await item.destroy() : null;
  }
}