import { Request, Response } from 'express';
import { AuthService } from '../../Domain/services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, role } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await this.authService.registerUser({ email, password, fullName, role });
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const result = await this.authService.loginUser(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      res.json(req.user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}