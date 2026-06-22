import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

export const sequelize = new Sequelize('loja', 'root', 'root', {
  host: process.env.MYSQL_HOST || 'localhost',
  dialect: 'mysql',
  logging: false
});

// Conecta ao MySQL com retry — evita a race condition em que o backend
// sobe antes de o MySQL estar realmente aceitando conexões no Docker.
export const connectMySQL = async (retries = 10, delayMs = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log(`✅ MySQL Conectado e Sincronizado (tentativa ${attempt})`);
      return;
    } catch (err) {
      console.error(`Tentativa ${attempt}/${retries} — MySQL indisponível: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
};

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/empresa');
    console.log('✅ MongoDB Conectado!');
  } catch (err) {
    console.error('Erro ao conectar MongoDB:', err.message);
  }
};
