import { Request, Response } from 'express';
export declare const analyticsController: {
    summary: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    trends: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    teamStatus: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    workload: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    taskTime: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    activity: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=analytics.controller.d.ts.map