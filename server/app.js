import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());
  app.use(hpp());

  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 250,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use(
    ['/api/contact', '/api/quotes/calculate', '/api/quotes/:quoteId/claim', '/api/retail/notify', '/api/auth/login', '/api/auth/register'],
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 8,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use('/api', publicRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
