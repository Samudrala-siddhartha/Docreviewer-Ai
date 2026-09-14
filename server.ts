/**
 * DocSure AI - Server Entry Point
 * Port 3000, Host 0.0.0.0
 * Integrates Vite middleware in dev, production static serving in prod.
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  createSecurityHeadersMiddleware,
  createRateLimiter,
  createAuthMiddleware,
  centralErrorHandler,
} from './src/server/middleware/security.ts';
import { createApiRouter } from './src/server/routes/api.ts';
import { UserRepository, SessionRepository, AuditRepository } from './src/server/repositories/memoryStore.ts';
import { AuthService } from './src/server/services/authService.ts';
import { AuditService } from './src/server/services/auditService.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsers with bounded limit for document uploads
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Security headers
  app.use(createSecurityHeadersMiddleware());

  // IP/token based rate limiter
  app.use(createRateLimiter(60 * 1000, 120));

  // Initialize Auth middleware
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const auditRepo = new AuditRepository();
  const auditService = new AuditService(auditRepo);
  const authService = new AuthService(userRepo, sessionRepo, auditService);

  app.use(createAuthMiddleware(authService));

  // Mount API router FIRST
  const apiRouter = createApiRouter();
  app.use('/api', apiRouter);

  // Central error handling
  app.use(centralErrorHandler);

  // Vite development middleware or production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DocSure AI] Enterprise screening service running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[DocSure AI Startup Error]:', err);
  process.exit(1);
});
