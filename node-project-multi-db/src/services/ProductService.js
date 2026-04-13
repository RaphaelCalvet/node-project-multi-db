export class ProductService {
  constructor(repository) {
      this.repository = repository;
  }
  async getAll() {
      return await this.repository.findAll();
  }

  async create(data) {
      return await this.repository.create(data);
  }

  async update(id, data) {
      return await this.repository.update(id, data);
  }

  async delete(id) { 
      return await this.repository.delete(id);
  }
}