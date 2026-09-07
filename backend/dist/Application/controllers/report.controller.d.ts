import { Request, Response } from 'express';
export declare const reportController: {
    list: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    get: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    submit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    review: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    addTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=report.controller.d.ts.map