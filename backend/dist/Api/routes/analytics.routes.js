"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../../Application/controllers/analytics.controller");
const auth_1 = require("../middleware/auth/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, (0, auth_1.requireRole)(['manager', 'admin']));
router.get('/summary', analytics_controller_1.analyticsController.summary);
router.get('/trends', analytics_controller_1.analyticsController.trends);
router.get('/team-status', analytics_controller_1.analyticsController.teamStatus);
router.get('/workload', analytics_controller_1.analyticsController.workload);
router.get('/task-time', analytics_controller_1.analyticsController.taskTime);
router.get('/activity', analytics_controller_1.analyticsController.activity);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map