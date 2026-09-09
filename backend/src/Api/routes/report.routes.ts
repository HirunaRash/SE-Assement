import { Router } from 'express';
import * as controller from './../../Application/controllers/report.controller';
import { authenticate, requireRoles } from './../middleware/auth/auth';
import { bodyRequired } from './../middleware/validation';

const router = Router();
router.use(authenticate);
router.get('/my-reports', requireRoles('team_member', 'manager', 'admin'), controller.myList);
router.get('/my-reports/:id', requireRoles('team_member', 'manager', 'admin'), controller.getMine);
router.get('/manager/all', requireRoles('manager', 'admin'), controller.getTeamReports);
router.post('/', requireRoles('team_member'), bodyRequired('weekStartDate', 'weekEndDate'), controller.create);
router.put('/:id', requireRoles('team_member'), controller.update);
router.patch('/:id', requireRoles('team_member'), controller.update);
router.put('/:id/submit', requireRoles('team_member'), controller.submit);
router.post('/:id/tasks', requireRoles('team_member'), bodyRequired('taskName'), controller.task);
router.put('/:id/tasks/:taskId', requireRoles('team_member'), controller.updateTask);
router.delete('/:id/tasks/:taskId', requireRoles('team_member'), controller.deleteTask);

for (const resource of ['blockers', 'achievements', 'next-week-tasks']) {
  router.post(`/:id/${resource}`, requireRoles('team_member'), controller.child);
  router.put(`/:id/${resource}/:taskId`, requireRoles('team_member'), controller.updateChild);
  router.delete(`/:id/${resource}/:taskId`, requireRoles('team_member'), controller.deleteChild);
}
router.post('/:id/time-by-type', requireRoles('team_member'), controller.time);
router.get('/', requireRoles('manager', 'admin'), controller.all);
router.get('/:id/versions/:versionNumber', requireRoles('team_member', 'manager', 'admin'), controller.version);
router.get('/:id/versions', requireRoles('team_member', 'manager', 'admin'), controller.versions);
router.get('/:id/review-history', requireRoles('manager', 'admin'), controller.history);
router.put('/:id/approve', requireRoles('manager', 'admin'), controller.approve);
router.put('/:id/request-changes', requireRoles('manager', 'admin'), bodyRequired('comment'), controller.requestChanges);
router.get('/:id', requireRoles('team_member', 'manager', 'admin'), controller.getAccessible);

export default router;
