import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-secret-dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export class AuthService {
  // Registra um novo usuário. O primeiro usuário do sistema vira admin.
  async register({ name, email, password }) {
      if (!name || !email || !password) {
          throw Object.assign(new Error('name, email e password são obrigatórios.'), { status: 400 });
      }
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
          throw Object.assign(new Error('E-mail já cadastrado.'), { status: 409 });
      }

      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user'; // bootstrap: 1º usuário é admin

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role });
      return this.#sign(user);
  }

  // Autentica por email + senha e devolve { token, user }.
  async login({ email, password }) {
      if (!email || !password) {
          throw Object.assign(new Error('email e password são obrigatórios.'), { status: 400 });
      }
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
          throw Object.assign(new Error('Credenciais inválidas.'), { status: 401 });
      }
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
          throw Object.assign(new Error('Credenciais inválidas.'), { status: 401 });
      }
      return this.#sign(user);
  }

  #sign(user) {
      const payload = { sub: user._id.toString(), role: user.role };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return { token, user };
  }
}
