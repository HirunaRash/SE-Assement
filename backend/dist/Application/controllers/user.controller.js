"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("../../Domain/services/user.service");
exports.userController = {
    list: async (_req, res) => { try {
        return res.json(await user_service_1.userService.list());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    get: async (req, res) => { try {
        return res.json(await user_service_1.userService.getById(Number(req.params.id)));
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    } },
    update: async (req, res) => { try {
        return res.json(await user_service_1.userService.update(Number(req.params.id), req.body));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    remove: async (req, res) => { try {
        await user_service_1.userService.remove(Number(req.params.id));
        return res.json({ message: 'User deleted' });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
};
//# sourceMappingURL=user.controller.js.map