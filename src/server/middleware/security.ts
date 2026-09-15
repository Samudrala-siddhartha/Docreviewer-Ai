/**
 * DocSure AI - Security Middlewares
 * Enforces rate limiting, role-based access control (RBAC),
 * secure headers, and centralized error sanitization.
 */

import { Request, Response, NextFunction } from 'express';
import { UserProfile, UserRole, ApiResponse } from '../../shared/types.ts';
import { AuthService } from '../services/authService.ts';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
      clientIp?: string;
    }
  }
}

// In-memory rate limiting map
interface RateLimitBucket {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitBucket>();

export function createSecurityHeadersMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Defense-in-depth headers (omit X-Frame-Options to allow preview embedding in AI Studio)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(self)');

    // Never cache API responses containing potentially sensitive inspection metadata
    if (req.path.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    // Extract client IP safely
    req.clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';

    next();
  };
}

export function createRateLimiter(windowMs: number = 60 * 1000, maxRequests: number = 60) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.clientIp || 'ip'}_${req.user?.id || 'anon'}`;
    const now = Date.now();

    const bucket = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 1;
      bucket.resetAt = now + windowMs;
    } else {
      bucket.count += 1;
    }

    rateLimitMap.set(key, bucket);

    if (bucket.count > maxRequests) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please throttle your verification requests.',
          category: 'RATE_LIMIT_ERROR',
        },
      };
      return res.status(429).json(response);
    }

    next();
  };
}

export function createAuthMiddleware(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Anonymous route or let requireRole intercept
    }

    const token = authHeader.split(' ')[1];
    try {
      const user = await authService.validateSession(token);
      if (user) {
        req.user = user;
      }
    } catch {
      // Invalid session token
    }
    next();
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication session required to access this resource.',
        category: 'AUTHENTICATION_ERROR',
      },
    };
    return res.status(401).json(response);
  }
  next();
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
          category: 'AUTHENTICATION_ERROR',
        },
      };
      return res.status(401).json(response);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of [${allowedRoles.join(', ')}] privileges.`,
          category: 'AUTHORIZATION_ERROR',
        },
      };
      return res.status(403).json(response);
    }

    next();
  };
}

// Robust async handler wrapper to guarantee errors forward to centralErrorHandler
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function centralErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // If response headers were already sent, delegate to Express default handler to prevent crashes
  if (res.headersSent) {
    return next(err);
  }

  const isDev = process.env.NODE_ENV !== 'production';
  console.error('[API Error]:', err?.message || err);

  // 1. Handle JSON Parsing Syntax Errors (e.g. malformed body sent to express.json)
  if (err instanceof SyntaxError && ('body' in err || (err as any).type === 'entity.parse.failed')) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'JSON_PARSE_ERROR',
        message: 'Malformed JSON payload. Please ensure request body is valid JSON.',
        category: 'VALIDATION_ERROR',
      },
    };
    return res.status(400).json(response);
  }

  // 2. Handle Payload Too Large (e.g. upload exceeds 15MB express limit)
  if ((err as any).type === 'entity.too.large' || err?.status === 413) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Uploaded payload exceeds the maximum permitted limit of 15MB. Please compress or resize the document.',
        category: 'VALIDATION_ERROR',
      },
    };
    return res.status(413).json(response);
  }

  // 3. Handle Rate Limiting Errors
  if (err?.code === 'RATE_LIMIT_EXCEEDED' || err?.status === 429) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: err?.message || 'Rate limit exceeded. Please throttle your verification requests.',
        category: 'RATE_LIMIT_ERROR',
      },
    };
    return res.status(429).json(response);
  }

  // 4. Client vs Server Error Resolution
  const statusCode = err?.status || err?.statusCode || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  const response: ApiResponse = {
    success: false,
    error: {
      code: err?.code || (isClientError ? 'CLIENT_REQUEST_ERROR' : 'INTERNAL_ERROR'),
      message: err?.message || 'An unexpected error occurred during processing.',
      category: err?.category || (isClientError ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR'),
      details: isDev && !isClientError ? err?.stack : undefined,
    },
  };

  res.status(statusCode).json(response);
}
