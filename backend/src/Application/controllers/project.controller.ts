import { Request, Response } from 'express';
import { projectService } from '../../Domain/services/project.service';

export const projectController = {
  list: async (_req: Request, res: Response) => { try { return res.json(await projectService.list()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  get: async (req: Request, res: Response) => { try { return res.json(await projectService.getById(Number(req.params.id))); } catch (error: any) { return res.status(404).json({ error: error.message }); } },
  create: async (req: Request, res: Response) => { try { return res.status(201).json(await projectService.create({ ...req.body, createdBy: req.user!.id })); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  update: async (req: Request, res: Response) => { try { return res.json(await projectService.update(Number(req.params.id), req.body)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  remove: async (req: Request, res: Response) => { try { await projectService.remove(Number(req.params.id)); return res.json({ message: 'Project deleted' }); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  assignMember: async (req: Request, res: Response) => { try { return res.status(201).json(await projectService.assignMember(Number(req.params.id), Number(req.body.userId), req.user!.id)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  removeMember: async (req: Request, res: Response) => { try { await projectService.removeMember(Number(req.params.id), Number(req.params.userId)); return res.json({ message: 'Member removed' }); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
};
