import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { config } from './config.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Express 5 compatibility patch for legacy middlewares (like express-mongo-sanitize)
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
      methods: ['GET', 'POST', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());

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

  // ── Partner login throttle ──
  app.use(
    '/api/partners/login',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many login attempts. Please try again later.' },
    })
  );

  // ── SECURITY: Aggressive order-creation throttle ──
  // Prevents brute-force transaction spamming and inventory exhaustion attacks.
  // Each IP is limited to 5 order creation attempts per 15-minute window.
  app.use(
    '/api/orders/create',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many transactions initiated from this IP. Please try again later.' },
    })
  );

  // ── SECURITY: Settlement & dispute throttle ──
  // Prevents brute-force attempts to guess QA clearance tokens.
  // Each IP is limited to 3 settlement/dispute requests per 15-minute window.
  app.use(
    ['/api/orders/settle', '/api/orders/dispute'],
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 3,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many settlement attempts from this IP. Please try again later.' },
    })
  );

  app.get('/', (req, res) => res.status(200).send("Welcome to BioLink Agri - India's Premier Bio-Manure Supply Corridor."));
  app.get('/about', (req, res) => res.status(200).json({ message: "BioLink Agri specializes in asset-light digital trade matching under small-business MSME tax-exempt status." }));
  app.get('/institutional', (req, res) => res.status(200).send("B2B 15-Ton Bulk Ordering Desk Portal Active."));
  app.get('/logistics', (req, res) => res.status(200).json({ rules: "All payloads utilize Gross-minus-Tare data verified at local Dharma Kanta platforms." }));
  app.get('/contact', (req, res) => res.status(200).send("BioLink Agri contact pipeline active. Secure forms route to regional desks."));
  app.get('/login', (req, res) => res.status(200).send("BioLink Agri Authentication System. Buyers vs. GOBARdhan Facility Managers login portals active."));

  app.use('/api', publicRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/partners', partnerRoutes);
  app.use('/api/partner', partnerRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
