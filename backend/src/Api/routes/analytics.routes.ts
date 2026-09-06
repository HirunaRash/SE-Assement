import { Router } from 'express';
import { AnalyticsController } from '../../Application/controllers/analytics.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/summary', authMiddleware, requireRole(['manager', 'admin']), 
  (req, res) => analyticsController.getSummary(req, res));
router.get('/trends', authMiddleware, requireRole(['manager', 'admin']), 
  (req, res) => analyticsController.getTrends(req, res));
router.get('/team-status', authMiddleware, requireRole(['manager', 'admin']), 
  (req, res) => analyticsController.getTeamStatus(req, res));
router.get('/workload', authMiddleware, requireRole(['manager', 'admin']), 
  (req, res) => analyticsController.getWorkload(req, res));
router.get('/team-status-by-week', authMiddleware, requireRole(['manager', 'admin']),
  (req, res) => analyticsController.getTeamStatusForWeek(req, res));
router.get('/activity', authMiddleware, requireRole(['manager', 'admin']),
  (req, res) => analyticsController.getRecentActivity(req, res));

export default router;