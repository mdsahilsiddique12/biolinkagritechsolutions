import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'partner-secret-key-change-in-production',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5174,http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};
