import { Router } from 'express';
import * as controller from './../../Application/controllers/user.controller';
import { authenticate, requireRoles } from './../middleware/auth/auth';
import { bodyRequired } from './../middleware/validation';

const router = Router();
router.use(authenticate);
router.get('/', requireRoles('manager', 'admin'), controller.list);
router.post('/', requireRoles('admin'), bodyRequired('email', 'firstName', 'lastName', 'role'), controller.create);
router.put('/:id', requireRoles('admin'), controller.update);
router.delete('/:id', requireRoles('admin'), controller.remove);
router.put('/:id/role', requireRoles('admin'), bodyRequired('role'), controller.setRole);
export default router;
