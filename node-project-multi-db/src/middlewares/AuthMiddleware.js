import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme-secret-dev';

export class AuthMiddleware {
  // Valida o JWT do header Authorization e injeta req.user.
  static async authenticate(req, res, next) {
    try {
      const header = req.headers.authorization || '';
      const [, token] = header.split(' ');
      if (!token) {
          return res.status(401).json({ error: 'Não autorizado', message: 'Token ausente.' });
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.sub);
      if (!user) {
          return res.status(401).json({ error: 'Não autorizado', message: 'Usuário inexistente.' });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Não autorizado', message: 'Token inválido ou expirado.' });
    }
  }

  // Fábrica de middleware de autorização por role(s).
  // Uso: app.delete('/users/:id', AuthMiddleware.authorize('admin'), ...)
  static authorize(...roles) {
    return (req, res, next) => {
      if (!req.user) {
          return res.status(401).json({ error: 'Não autorizado', message: 'Autenticação necessária.' });
      }
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({ error: 'Acesso negado', message: 'Permissão insuficiente.' });
      }
      next();
    };
  }
}
