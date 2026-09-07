import { Request, Response } from 'express';
import { authService } from '../../Domain/services/auth.service';

export const authController = {
  register: async (req: Request, res: Response) => {
    try { const result = await authService.register(req.body); return res.status(201).json(result); } catch (error: any) { return res.status(400).json({ error: error.message }); }
  },
  login: async (req: Request, res: Response) => {
    try { const { email, password } = req.body; if (!email || !password) return res.status(400).json({ error: 'Email and password are required' }); return res.json(await authService.login(email, password)); } catch (error: any) { return res.status(401).json({ error: error.message }); }
  },
  me: async (req: Request, res: Response) => {
    try { return res.json(await authService.me(req.user!.id)); } catch (error: any) { return res.status(404).json({ error: error.message }); }
  },
};
