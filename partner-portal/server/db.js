import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!config.mongoUri) {
    console.warn('MongoDB URI not configured for Partner Portal.');
    return;
  }
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB for Partner Portal.');
}
