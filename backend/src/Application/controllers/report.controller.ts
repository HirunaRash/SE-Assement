import { Request, Response } from 'express';
import { reportService } from '../../Domain/services/report.service';

const id = (value: string | string[]) => Number(Array.isArray(value) ? value[0] : value);

export const reportController = {
  list: async (req: Request, res: Response) => { try { const filters = { status: req.query.status as any, userId: req.query.userId ? Number(req.query.userId) : undefined, startDate: req.query.startDate ? new Date(String(req.query.startDate)) : undefined, endDate: req.query.endDate ? new Date(String(req.query.endDate)) : undefined }; return res.json(await reportService.list(req.user!.id, req.user!.roles, filters)); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  get: async (req: Request, res: Response) => { try { return res.json(await reportService.getById(id(req.params.id), req.user!.id, req.user!.roles)); } catch (error: any) { return res.status(error.message === 'Access denied' ? 403 : 404).json({ error: error.message }); } },
  create: async (req: Request, res: Response) => { try { return res.status(201).json(await reportService.create(req.user!.id, req.body)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  update: async (req: Request, res: Response) => { try { return res.json(await reportService.update(id(req.params.id), req.user!.id, req.user!.roles, req.body)); } catch (error: any) { return res.status(error.message === 'Access denied' ? 403 : 400).json({ error: error.message }); } },
  submit: async (req: Request, res: Response) => { try { return res.json(await reportService.submit(id(req.params.id), req.user!.id, req.user!.roles)); } catch (error: any) { return res.status(error.message === 'Access denied' ? 403 : 400).json({ error: error.message }); } },
  review: async (req: Request, res: Response) => { try { const action = req.body.action === 'approve' || req.body.action === 'approved' ? 'approved' : 'needs_correction'; return res.json(await reportService.review(id(req.params.id), req.user!.id, action, req.body.comment)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  addTask: async (req: Request, res: Response) => { try { return res.status(201).json(await reportService.addTask(id(req.params.id), req.user!.id, req.user!.roles, req.body)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  updateTask: async (req: Request, res: Response) => { try { return res.json(await reportService.updateTask(id(req.params.taskId), req.body)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  deleteTask: async (req: Request, res: Response) => { try { await reportService.deleteTask(id(req.params.taskId)); return res.json({ message: 'Task deleted' }); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
};
