import { Request, Response } from 'express';
export declare const summary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const submissionByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const tasksTrend: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const workload: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const timeByType: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const recentActivity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const blockers: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const trends: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const teamStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const activity: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=analytics.controller.d.ts.map