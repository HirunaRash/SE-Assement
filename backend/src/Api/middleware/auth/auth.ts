import { NextFunction, Request, Response } from 'express';
import { authService } from '../../../Domain/services/auth.service';
import type { AuthTokenPayload } from '../../../Domain/services/auth.service';

export interface AuthPayload {
  userId: number;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRoles?: string[];
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return res.status(401).json({ error: 'Authentication token is required' });
  try {
    const payload: AuthTokenPayload = authService.verifyToken(token);
    req.userId = Number(payload.userId);
    req.userRoles = payload.roles;
    console.log(`[auth middleware] user ${req.userId} roles: ${req.userRoles.join(', ')}`);
    return next();
  } catch (error) {
    console.error('[auth middleware] token validation failed', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

export const roleCheckMiddleware = (requiredRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const roles = req.userRoles || [];
  if (!roles.some((role) => requiredRoles.includes(role))) return res.status(403).json({ error: 'Insufficient permissions' });
  return next();
};

export const authenticate = authMiddleware;
export const requireRoles = (...requiredRoles: string[]) => roleCheckMiddleware(requiredRoles);
export const auth = authMiddleware;
export const role = requireRoles;
