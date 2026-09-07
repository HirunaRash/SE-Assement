"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const analytics_service_1 = require("../../Domain/services/analytics.service");
exports.analyticsController = {
    summary: async (_req, res) => { try {
        return res.json(await analytics_service_1.analyticsService.summary());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    trends: async (_req, res) => { try {
        return res.json(await analytics_service_1.analyticsService.trends());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    teamStatus: async (_req, res) => { try {
        return res.json(await analytics_service_1.analyticsService.teamStatus());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    workload: async (_req, res) => { try {
        return res.json(await analytics_service_1.analyticsService.workload());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    taskTime: async (_req, res) => { try {
        return res.json(await analytics_service_1.analyticsService.taskTime());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
    activity: async (_req, res) => { try {
        return res.json(await analytics_service_1.analyticsService.activity());
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    } },
};
//# sourceMappingURL=analytics.controller.js.map