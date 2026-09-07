import { Router } from 'express';
import * as controller from './../../Application/controllers/user.controller';
import { authenticate, requireRoles } from './../middleware/auth/auth';
import { bodyRequired } from './../middleware/validation';

const router = Router();
router.use(authenticate, requireRoles('admin'));
router.get('/', controller.list);
router.post('/', bodyRequired('email', 'firstName', 'lastName', 'role'), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.put('/:id/role', bodyRequired('role'), controller.setRole);
export default router;
