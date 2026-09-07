"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../../Domain/services/auth.service");
exports.authController = {
    register: async (req, res) => {
        try {
            const result = await auth_service_1.authService.register(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ error: 'Email and password are required' });
            return res.json(await auth_service_1.authService.login(email, password));
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    },
    me: async (req, res) => {
        try {
            return res.json(await auth_service_1.authService.me(req.user.id));
        }
        catch (error) {
            return res.status(404).json({ error: error.message });
        }
    },
};
//# sourceMappingURL=auth.controller.js.map