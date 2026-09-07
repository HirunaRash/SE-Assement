"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const project_service_1 = require("../../Domain/services/project.service");
exports.projectController = {
    list: async (_req, res) => { try {
        return res.json(await project_service_1.projectService.list());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    get: async (req, res) => { try {
        return res.json(await project_service_1.projectService.getById(Number(req.params.id)));
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    } },
    create: async (req, res) => { try {
        return res.status(201).json(await project_service_1.projectService.create({ ...req.body, createdBy: req.user.id }));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    update: async (req, res) => { try {
        return res.json(await project_service_1.projectService.update(Number(req.params.id), req.body));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    remove: async (req, res) => { try {
        await project_service_1.projectService.remove(Number(req.params.id));
        return res.json({ message: 'Project deleted' });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    assignMember: async (req, res) => { try {
        return res.status(201).json(await project_service_1.projectService.assignMember(Number(req.params.id), Number(req.body.userId), req.user.id));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    removeMember: async (req, res) => { try {
        await project_service_1.projectService.removeMember(Number(req.params.id), Number(req.params.userId));
        return res.json({ message: 'Member removed' });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
};
//# sourceMappingURL=project.controller.js.map