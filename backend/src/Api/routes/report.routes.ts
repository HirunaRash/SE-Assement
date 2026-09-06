import { Router, Request, Response } from 'express';
import { ReportController } from '../../Application/controllers/report.controller';
import { authMiddleware, requireRole } from '../middleware/auth/auth';

const router = Router();
const reportController = new ReportController();

// Team member routes
router.post('/', authMiddleware, (req, res) => reportController.createReport(req, res));
router.get('/', authMiddleware, (req, res) => reportController.getUserReports(req, res));
router.get('/:id', authMiddleware, (req, res) => reportController.getReport(req, res));
router.patch('/:id', authMiddleware, (req, res) => reportController.updateReport(req, res));
router.patch('/:id/submit', authMiddleware, (req, res) => reportController.submitReport(req, res));

// Manager routes
router.get('/manager/all', authMiddleware, requireRole(['manager', 'admin']), 
  (req, res) => reportController.getAllReports(req, res));
router.patch('/:id/review', authMiddleware, requireRole(['manager', 'admin']), 
  (req, res) => reportController.reviewReport(req, res));

router.post('/:id/tasks', authMiddleware, (req, res) => reportController.addTask(req, res));
router.patch('/tasks/:taskId', authMiddleware, (req, res) => reportController.updateTask(req, res));
router.delete('/tasks/:taskId', authMiddleware, (req, res) => reportController.deleteTask(req, res));

export default router;