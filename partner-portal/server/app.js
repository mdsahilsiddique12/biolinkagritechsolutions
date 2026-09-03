import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config.js';
import partnerRoutes from './routes/partnerRoutes.js';

export function createApp() {
  const app = express();

  app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  });

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || config.clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());

  app.use(
    '/api/partners/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get('/', (_req, res) => res.status(200).send('BioLink Partner Portal API Active.'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/partners', partnerRoutes);

  return app;
}
