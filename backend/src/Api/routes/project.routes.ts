import { Router } from 'express';
import { projectController } from '../../Application/controllers/project.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
router.use(authMiddleware);
router.get('/', projectController.list);
router.get('/:id', projectController.get);
router.post('/', requireRole(['manager', 'admin']), projectController.create);
router.patch('/:id', requireRole(['manager', 'admin']), projectController.update);
router.delete('/:id', requireRole(['manager', 'admin']), projectController.remove);
router.post('/:id/members', requireRole(['manager', 'admin']), projectController.assignMember);
router.delete('/:id/members/:userId', requireRole(['manager', 'admin']), projectController.removeMember);
export default router;
