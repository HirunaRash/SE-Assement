import { Router } from 'express';
import { userController } from '../../Application/controllers/user.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
router.use(authMiddleware, requireRole(['manager', 'admin']));
router.get('/', userController.list);
router.get('/:id', userController.get);
router.patch('/:id', userController.update);
router.delete('/:id', userController.remove);
export default router;
