import bcrypt from 'bcryptjs';

export class UserService {
  constructor(repository) {
      this.repository = repository;
  }

  async getAll() {
      return await this.repository.findAll();
  }

  async create(data) {
      // Hasheia a senha antes de persistir
      if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
      }
      return await this.repository.create(data);
  }

  async update(id, data) {
      // Re-hasheia caso a senha esteja sendo alterada
      if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
      }
      return await this.repository.update(id, data);
  }

  async delete(id) {
      return await this.repository.delete(id);
  }
}
