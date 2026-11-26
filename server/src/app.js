
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import adminRoutes from './routes/admin/index.js';

import {
  notFound,
  errorHandler,
} from './middlewares/error.middleware.js';

import { trustedOrigin } from './middlewares/origin.middleware.js';
import { sanitizeInputs } from './middlewares/sanitize.middleware.js';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

const isProd = process.env.NODE_ENV === 'production';

// Dynamically combine configured CLIENT_URL with known origins
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map(u => u.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const origins = [
  'https://dakshayani-restaurant-xi.vercel.app',
  'https://dakshayani-restaurant-krvpevjyz-shivek-yadav.vercel.app',
  'https://dakshayani-restaurant-mn1k.vercel.app',
  'http://localhost:5173',
  ...clientUrls
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Robust security headers via Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  })
);

// Body parsing with size limit
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Anti-NoSQL-injection sanitizer (strips malicious operators from body, query & params)
app.use(sanitizeInputs);

// Validate origins for protected cross-origin mutations
app.use('/api', trustedOrigin(origins));

// Health check and Keep-Alive / Cron Warmup endpoints (keeps server and database active 24/7)
const handleWarmup = async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    if (mongoose.connection.readyState === 1) {
      dbStatus = 'connected';
      await mongoose.connection.db?.admin?.()?.ping?.().catch(() => {});
    } else {
      dbStatus = 'fallback_store_active';
    }
  } catch {
    dbStatus = 'resilient_local_mode';
  }

  res.json({
    status: 'online',
    warm: true,
    message: 'All Vijay Woollen Works backend APIs are active, warm, and operational.',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    endpoints: {
      catalog: '/api/v1/menu',
      categories: '/api/v1/categories',
      gallery: '/api/v1/gallery',
      health: '/api/v1/health'
    }
  });
};

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

app.get('/api/v1/cron/warmup', handleWarmup);
app.get('/api/v1/keepalive', handleWarmup);
app.get('/api/v1/ping', handleWarmup);

// Global API rate limiter (protects against scraping and volumetric DDoS, skips cron & health pings)
const globalApiLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProd ? 300 : 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => ['/api/v1/health', '/api/v1/keepalive', '/api/v1/ping', '/api/v1/cron/warmup'].includes(req.path),
  message: {
    message: 'Too many requests from this IP. Please slow down and try again later.',
  },
});
app.use('/api', globalApiLimit);

// Customer auth rate limiter
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProd ? 30 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many login or registration attempts. Please try again after 15 minutes.',
  },
});

// Strict Admin login rate limiter (prevents credential stuffing & brute force in production)
const adminAuthLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProd ? 15 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many admin authentication attempts. For security, please wait 15 minutes before trying again.',
  },
});

// Contact & wholesale quotation inquiry form rate limiter
const formLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many messages sent. Please try again later or contact our factory directly.',
  },
});

// Orders & sample requests rate limiter (prevents order flooding)
const orderLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many order submissions. Please wait a moment before trying again.',
  },
});

// API routes with attached rate limiters
app.use('/api/v1/inquiries', formLimit);
app.use('/api/v1/order-request', orderLimit);
app.use('/api/v1/orders', orderLimit);
app.use('/api/v1/bookings', orderLimit);
app.use('/api/v1/auth', authLimit, authRoutes);
app.use('/api/v1/admin/auth/login', adminAuthLimit);

app.use('/api/v1', publicRoutes);
app.use('/api/v1', customerRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

export { app };
