import { Router } from 'express';
import * as authController from './../../Application/controllers/auth.controller';
import { authenticate } from './../middleware/auth/auth';

const router = Router();

// Mounted by index.ts at /api/auth, so this becomes POST /api/auth/register.
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.put('/me', authenticate, authController.updateMe);

export default router;
