"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../../Application/controllers/project.controller");
const auth_1 = require("../middleware/auth/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', project_controller_1.projectController.list);
router.get('/:id', project_controller_1.projectController.get);
router.post('/', (0, auth_1.requireRole)(['manager', 'admin']), project_controller_1.projectController.create);
router.patch('/:id', (0, auth_1.requireRole)(['manager', 'admin']), project_controller_1.projectController.update);
router.delete('/:id', (0, auth_1.requireRole)(['manager', 'admin']), project_controller_1.projectController.remove);
router.post('/:id/members', (0, auth_1.requireRole)(['manager', 'admin']), project_controller_1.projectController.assignMember);
router.delete('/:id/members/:userId', (0, auth_1.requireRole)(['manager', 'admin']), project_controller_1.projectController.removeMember);
exports.default = router;
//# sourceMappingURL=project.routes.js.map