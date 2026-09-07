"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../Application/controllers/user.controller");
const auth_1 = require("../middleware/auth/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, (0, auth_1.requireRole)(['manager', 'admin']));
router.get('/', user_controller_1.userController.list);
router.get('/:id', user_controller_1.userController.get);
router.patch('/:id', user_controller_1.userController.update);
router.delete('/:id', user_controller_1.userController.remove);
exports.default = router;
//# sourceMappingURL=user.routes.js.map