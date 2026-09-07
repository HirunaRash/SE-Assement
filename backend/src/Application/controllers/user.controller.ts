import { Request, Response } from 'express';
import { userService } from '../../Domain/services/user.service';

export const userController = {
  list: async (_req: Request, res: Response) => { try { return res.json(await userService.list()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  get: async (req: Request, res: Response) => { try { return res.json(await userService.getById(Number(req.params.id))); } catch (error: any) { return res.status(404).json({ error: error.message }); } },
  update: async (req: Request, res: Response) => { try { return res.json(await userService.update(Number(req.params.id), req.body)); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
  remove: async (req: Request, res: Response) => { try { await userService.remove(Number(req.params.id)); return res.json({ message: 'User deleted' }); } catch (error: any) { return res.status(400).json({ error: error.message }); } },
};
