import { NextFunction, Request, Response } from 'express';
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
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const roleCheckMiddleware: (requiredRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const authenticate: typeof authMiddleware;
export declare const requireRoles: (...requiredRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const auth: typeof authMiddleware;
export declare const role: typeof requireRoles;
//# sourceMappingURL=auth.d.ts.map