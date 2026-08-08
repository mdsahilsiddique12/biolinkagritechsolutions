import mongoose from 'mongoose';
import { config } from './config.js';

let connectionPromise;

export function connectDatabase() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
  }

  return connectionPromise;
}
