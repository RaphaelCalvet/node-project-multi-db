import User from '../models/UserModel.js';

export class UserRepository {
  async create(data) {
      return await User.create(data);
  }

  async findAll() {
      return await User.find();
  }

  async findById(id) {
      return await User.findById(id);
  }

  async update(id, data) {
      return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
      await User.findByIdAndDelete(id);
  }
}