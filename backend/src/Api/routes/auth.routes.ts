import { Router, Request, Response } from 'express';
import { AuthController } from '../../Application/controllers/auth.controller';
import { authMiddleware } from '../middleware/auth/auth';

const router = Router();
const authController = new AuthController();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', authMiddleware, (req, res) => authController.getMe(req, res));

export default router;