import { Router } from 'express';
import * as controller from './../../Application/controllers/analytics.controller';
import { authenticate, requireRoles } from './../middleware/auth/auth';

const router = Router();
router.use(authenticate, requireRoles('manager', 'admin'));
router.get('/summary', controller.summary);
router.get('/submission-by-user', controller.submissionByUser);
router.get('/tasks-completed-trend', controller.tasksTrend);
router.get('/workload-by-project', controller.workload);
router.get('/time-by-task-type', controller.timeByType);
router.get('/recent-activity', controller.recentActivity);
router.get('/blockers', controller.blockers);
router.get('/trends', controller.trends);
router.get('/team-status', controller.teamStatus);
router.get('/workload', controller.workload);
router.get('/activity', controller.activity);
export default router;
