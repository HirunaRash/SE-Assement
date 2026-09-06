import { Router } from 'express';
import { ProjectController } from '../../Application/controllers/project.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
const projectController = new ProjectController();

router.get('/', authMiddleware, (req, res) => projectController.getAllProjects(req, res));
router.post('/', authMiddleware, requireRole(['manager', 'admin']), (req, res) => projectController.createProject(req, res));
router.patch('/:id', authMiddleware, requireRole(['manager', 'admin']), (req, res) => projectController.updateProject(req, res));
router.delete('/:id', authMiddleware, requireRole(['manager', 'admin']), (req, res) => projectController.deleteProject(req, res));

export default router;