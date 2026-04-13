import express from 'express';
import { sequelize, connectMongo } from './config/db.js';
import { GlobalMiddleware } from './middlewares/GlobalMiddleware.js';
import { ProductRepository } from './repositories/ProductRepository.js';
import { ProductService } from './services/ProductService.js';
import { ProductController } from './controllers/ProductController.js';
import { UserRepository } from './repositories/UserRepository.js';
import { UserService } from './services/UserService.js';
import { UserController } from './controllers/UserController.js';

const app = express();
app.use(express.json());
app.use(GlobalMiddleware.logger);

const productController = new ProductController(new ProductService(new ProductRepository()));
const userController = new UserController(new UserService(new UserRepository()));

await connectMongo();
await sequelize.sync(); // MySQL
console.log('✅ MySQL Conectado e Sincronizado');

app.get('/products', productController.getAll);
app.post('/products', productController.create);
app.put('/products/:id', productController.update);
app.delete('/products/:id', productController.delete);

app.get('/users', userController.getAll);
app.post('/users', userController.create);
app.put('/users/:id', userController.update);
app.delete('/users/:id', userController.delete);

app.use(GlobalMiddleware.errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});