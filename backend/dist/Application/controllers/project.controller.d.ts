import { Request, Response } from 'express';
export declare const list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProjects: typeof list;
export declare const get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const remove: (req: Request, res: Response) => Promise<void>;
export declare const addMember: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const removeMember: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=project.controller.d.ts.map