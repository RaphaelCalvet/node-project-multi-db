import express from 'express';
import cors from 'cors';
import { connectMongo, connectMySQL } from './config/db.js';
import { GlobalMiddleware } from './middlewares/GlobalMiddleware.js';
import { AuthMiddleware } from './middlewares/AuthMiddleware.js';
import { ProductRepository } from './repositories/ProductRepository.js';
import { ProductService } from './services/ProductService.js';
import { ProductController } from './controllers/ProductController.js';
import { UserRepository } from './repositories/UserRepository.js';
import { UserService } from './services/UserService.js';
import { UserController } from './controllers/UserController.js';
import { AuthService } from './services/AuthService.js';
import { AuthController } from './controllers/AuthController.js';
import bcrypt from 'bcryptjs';
import User from './models/UserModel.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(GlobalMiddleware.logger);

// --- Injeção de dependência (controllers -> services -> repositories) ---
const productController = new ProductController(new ProductService(new ProductRepository()));
const userService = new UserService(new UserRepository());
const userController = new UserController(userService);
const authController = new AuthController(new AuthService());

// --- Conexões de banco (com retry para o MySQL no Docker) ---
await connectMongo();
await connectMySQL();

// --- Seed: cria um admin padrão caso ainda não exista nenhum usuário ---
async function seedAdmin() {
  const count = await User.countDocuments();
  if (count === 0) {
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      name: 'Administrador',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashed,
      role: 'admin'
    });
    console.log('✅ Usuário admin criado via seed');
  }
}
await seedAdmin();

// ----------------------------- Rotas públicas -----------------------------
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// ---------------------------- Rotas protegidas ----------------------------
// Qualquer usuário autenticado pode ler produtos e usuários.
app.get('/products', AuthMiddleware.authenticate, productController.getAll);
app.get('/users', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), userController.getAll);

// Criar/editar/remover exige autenticação (qualquer role para produtos).
app.post('/products', AuthMiddleware.authenticate, productController.create);
app.put('/products/:id', AuthMiddleware.authenticate, productController.update);
app.delete('/products/:id', AuthMiddleware.authenticate, productController.delete);

// Operações de escrita em usuários são restritas a admins.
app.post('/users', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), userController.create);
app.put('/users/:id', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), userController.update);
app.delete('/users/:id', AuthMiddleware.authenticate, AuthMiddleware.authorize('admin'), userController.delete);

// Perfil do usuário autenticado.
app.get('/auth/me', AuthMiddleware.authenticate, authController.me);

app.use(GlobalMiddleware.errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
