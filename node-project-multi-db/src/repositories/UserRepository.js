import User from '../models/UserModel.js';

export class UserRepository {
  async create(data) {
      return await User.create(data);
  }

  async findAll() {
      return await User.find().sort({ createdAt: -1 });
  }

  async findById(id) {
      return await User.findById(id);
  }

  // Usado na autenticação: retorna o documento "cru", incluindo a senha.
  async findByEmailWithPassword(email) {
      return await User.findOne({ email }).select('+password');
  }

  async update(id, data) {
      return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
      await User.findByIdAndDelete(id);
  }
}
