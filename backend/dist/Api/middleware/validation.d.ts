import { NextFunction, Request, Response } from 'express';
export declare const validateEmail: (email: unknown) => email is string;
export declare const validatePassword: (password: unknown) => password is string;
export declare const bodyRequired: (...fields: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const parseId: (value: string) => number | null;
export declare const authFields: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=validation.d.ts.map