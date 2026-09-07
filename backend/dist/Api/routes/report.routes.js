"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../../Application/controllers/report.controller");
const auth_1 = require("../middleware/auth/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', report_controller_1.reportController.list);
router.post('/', report_controller_1.reportController.create);
router.get('/manager/all', (0, auth_1.requireRole)(['manager', 'admin']), report_controller_1.reportController.list);
router.get('/:id', report_controller_1.reportController.get);
router.patch('/:id', report_controller_1.reportController.update);
router.patch('/:id/submit', report_controller_1.reportController.submit);
router.patch('/:id/review', (0, auth_1.requireRole)(['manager', 'admin']), report_controller_1.reportController.review);
router.post('/:id/tasks', report_controller_1.reportController.addTask);
router.patch('/tasks/:taskId', report_controller_1.reportController.updateTask);
router.delete('/tasks/:taskId', report_controller_1.reportController.deleteTask);
exports.default = router;
//# sourceMappingURL=report.routes.js.map