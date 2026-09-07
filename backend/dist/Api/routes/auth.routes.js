"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../Application/controllers/auth.controller");
const auth_1 = require("../middleware/auth/auth");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.authController.register);
router.post('/login', auth_controller_1.authController.login);
router.get('/me', auth_1.authMiddleware, auth_controller_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map