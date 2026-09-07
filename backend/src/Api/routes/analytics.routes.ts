import { Router } from 'express';
import { analyticsController } from '../../Application/controllers/analytics.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
router.use(authMiddleware, requireRole(['manager', 'admin']));
router.get('/summary', analyticsController.summary);
router.get('/trends', analyticsController.trends);
router.get('/team-status', analyticsController.teamStatus);
router.get('/workload', analyticsController.workload);
router.get('/task-time', analyticsController.taskTime);
router.get('/activity', analyticsController.activity);
export default router;
