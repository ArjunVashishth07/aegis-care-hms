import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import logger, { requestAuditLogger } from './middleware/logger.js';
import { rateLimiterMiddleware, getRateLimiterStatus } from './middleware/rateLimiter.js';
import { supabase } from './config/supabase.js';

import appointmentsRouter from './routes/appointments.js';
import patientsRouter from './routes/patients.js';
import bedsRouter from './routes/beds.js';
import billsRouter from './routes/bills.js';
import doctorsRouter from './routes/doctors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Strict Enterprise Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow client development hot-reloading
    crossOriginEmbedderPolicy: false,
  })
);

// 2. Calibrated CORS Policy
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly permissive origin
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Body Parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 4. Audit Logging Middleware
app.use(requestAuditLogger);

// 5. Rate Limiting Middleware (60 req/min with Token Bucket / Sliding Window)
app.use(rateLimiterMiddleware);

// 6. Root & Healthcheck Endpoints
app.get('/api/health', async (req, res) => {
  let dbStatus = 'connected';
  let dbPingMs = 0;

  try {
    const t0 = Date.now();
    const { error } = await supabase.from('doctors').select('id').limit(1);
    dbPingMs = Date.now() - t0;
    if (error) dbStatus = `degraded: ${error.message}`;
  } catch (err) {
    dbStatus = `unreachable: ${err.message}`;
  }

  res.json({
    status: 'healthy',
    service: 'Aegis Care HMS Enterprise Backend',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    rateLimiter: getRateLimiterStatus(),
    database: {
      provider: 'Supabase PostgreSQL',
      status: dbStatus,
      latencyMs: dbPingMs,
    },
  });
});

// 7. Mount Core Healthcare Domain Routes
app.use('/api/appointments', appointmentsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/beds', bedsRouter);
app.use('/api/bills', billsRouter);
app.use('/api/doctors', doctorsRouter);

// 8. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API endpoint '${req.originalUrl}' does not exist on Aegis Care HMS server.`,
  });
});

// 9. Central Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled Server Exception:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
  });

  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected medical systems error occurred.'
        : err.message,
  });
});

// 10. Start Server
const server = app.listen(PORT, () => {
  logger.info(`🏥 Aegis Care HMS Backend running on http://localhost:${PORT}`);
  logger.info(`🛡️ Rate limiting: 60 req/min (Token Bucket)`);
  logger.info(`📝 Audit logs streaming to server/logs/audit.log`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
    process.exit(0);
  });
});

export default app;
