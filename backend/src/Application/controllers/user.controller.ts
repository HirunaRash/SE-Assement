import { Request, Response } from 'express';
import { userService } from '../../Domain/services/user.service';
import { numberParam } from '../../Api/utils/params';

export const list = async (req: Request, res: Response) => res.json({ data: await userService.list(typeof req.query.role === 'string' ? req.query.role : undefined, numberParam(req.query.skip, 0), numberParam(req.query.take, 20, 1, 100)) });
export const create = async (req: Request, res: Response) => res.status(201).json({ data: await userService.create(req.body, req.userId!) });
export const update = async (req: Request, res: Response) => res.json({ data: await userService.update(Number(req.params.id), req.body) });
export const remove = async (req: Request, res: Response) => { await userService.remove(Number(req.params.id)); res.json({ success: true }); };
export const setRole = async (req: Request, res: Response) => res.json({ data: await userService.setRole(Number(req.params.id), req.body.role, req.userId!) });
