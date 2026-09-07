"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportController = void 0;
const report_service_1 = require("../../Domain/services/report.service");
const id = (value) => Number(Array.isArray(value) ? value[0] : value);
exports.reportController = {
    list: async (req, res) => { try {
        const filters = { status: req.query.status, userId: req.query.userId ? Number(req.query.userId) : undefined, startDate: req.query.startDate ? new Date(String(req.query.startDate)) : undefined, endDate: req.query.endDate ? new Date(String(req.query.endDate)) : undefined };
        return res.json(await report_service_1.reportService.list(req.user.id, req.user.roles, filters));
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    get: async (req, res) => { try {
        return res.json(await report_service_1.reportService.getById(id(req.params.id), req.user.id, req.user.roles));
    }
    catch (error) {
        return res.status(error.message === 'Access denied' ? 403 : 404).json({ error: error.message });
    } },
    create: async (req, res) => { try {
        return res.status(201).json(await report_service_1.reportService.create(req.user.id, req.body));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    update: async (req, res) => { try {
        return res.json(await report_service_1.reportService.update(id(req.params.id), req.user.id, req.user.roles, req.body));
    }
    catch (error) {
        return res.status(error.message === 'Access denied' ? 403 : 400).json({ error: error.message });
    } },
    submit: async (req, res) => { try {
        return res.json(await report_service_1.reportService.submit(id(req.params.id), req.user.id, req.user.roles));
    }
    catch (error) {
        return res.status(error.message === 'Access denied' ? 403 : 400).json({ error: error.message });
    } },
    review: async (req, res) => { try {
        const action = req.body.action === 'approve' || req.body.action === 'approved' ? 'approved' : 'needs_correction';
        return res.json(await report_service_1.reportService.review(id(req.params.id), req.user.id, action, req.body.comment));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    addTask: async (req, res) => { try {
        return res.status(201).json(await report_service_1.reportService.addTask(id(req.params.id), req.user.id, req.user.roles, req.body));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    updateTask: async (req, res) => { try {
        return res.json(await report_service_1.reportService.updateTask(id(req.params.taskId), req.body));
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
    deleteTask: async (req, res) => { try {
        await report_service_1.reportService.deleteTask(id(req.params.taskId));
        return res.json({ message: 'Task deleted' });
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    } },
};
//# sourceMappingURL=report.controller.js.map