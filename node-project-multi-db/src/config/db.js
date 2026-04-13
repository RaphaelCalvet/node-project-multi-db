import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

export const sequelize = new Sequelize('loja', 'root', 'root', {
  host: process.env.MYSQL_HOST || 'localhost',
  dialect: 'mysql',
  logging: false
});

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/empresa');
    console.log('MongoDB Conectado!');
  } catch (err) {
    console.error('Erro ao conectar MongoDB:', err.message);
  }
};