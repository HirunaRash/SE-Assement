import { Router } from 'express';
import * as controller from './../../Application/controllers/project.controller';
import { authenticate, requireRoles } from './../middleware/auth/auth';
import { bodyRequired } from './../middleware/validation';

const router = Router();
router.use(authenticate);
router.get('/', controller.list);
router.post('/', requireRoles('manager', 'admin'), bodyRequired('name'), controller.create);
router.get('/:id', controller.get);
router.put('/:id', requireRoles('manager', 'admin'), controller.update);
router.patch('/:id', requireRoles('manager', 'admin'), controller.update);
router.delete('/:id', requireRoles('manager', 'admin'), controller.remove);
router.post('/:id/team-members', requireRoles('manager', 'admin'), bodyRequired('userId'), controller.addMember);
router.delete('/:id/team-members/:userId', requireRoles('manager', 'admin'), controller.removeMember);
export default router;
