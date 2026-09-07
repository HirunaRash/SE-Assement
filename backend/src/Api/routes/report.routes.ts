import { Router } from 'express';
import { reportController } from '../../Application/controllers/report.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
router.use(authMiddleware);
router.get('/', reportController.list);
router.post('/', reportController.create);
router.get('/manager/all', requireRole(['manager', 'admin']), reportController.list);
router.get('/:id', reportController.get);
router.patch('/:id', reportController.update);
router.patch('/:id/submit', reportController.submit);
router.patch('/:id/review', requireRole(['manager', 'admin']), reportController.review);
router.post('/:id/tasks', reportController.addTask);
router.patch('/tasks/:taskId', reportController.updateTask);
router.delete('/tasks/:taskId', reportController.deleteTask);
export default router;
