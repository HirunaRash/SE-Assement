"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activity = exports.teamStatus = exports.trends = exports.blockers = exports.recentActivity = exports.timeByType = exports.workload = exports.tasksTrend = exports.submissionByUser = exports.summary = void 0;
const analytics_service_1 = require("../../Domain/services/analytics.service");
const params_1 = require("../../Api/utils/params");
const summary = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.summary((0, params_1.optionalDate)(req.query.weekStart)) });
exports.summary = summary;
const submissionByUser = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.submissionByUser((0, params_1.optionalDate)(req.query.weekStart)) });
exports.submissionByUser = submissionByUser;
const tasksTrend = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.tasksTrend((0, params_1.optionalDate)(req.query.startDate), (0, params_1.optionalDate)(req.query.endDate)) });
exports.tasksTrend = tasksTrend;
const workload = async (_req, res) => res.json({ data: await analytics_service_1.analyticsService.workload() });
exports.workload = workload;
const timeByType = async (_req, res) => res.json({ data: await analytics_service_1.analyticsService.timeByType() });
exports.timeByType = timeByType;
const recentActivity = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.recentActivity((0, params_1.numberParam)(req.query.limit, 10, 1, 100)) });
exports.recentActivity = recentActivity;
const blockers = async (_req, res) => res.json({ data: await analytics_service_1.analyticsService.blockers() });
exports.blockers = blockers;
// Compatibility endpoints used by the existing manager dashboard.
const trends = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.tasksTrend((0, params_1.optionalDate)(req.query.startDate), (0, params_1.optionalDate)(req.query.endDate)) });
exports.trends = trends;
const teamStatus = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.submissionByUser((0, params_1.optionalDate)(req.query.weekStart)) });
exports.teamStatus = teamStatus;
const activity = async (req, res) => res.json({ data: await analytics_service_1.analyticsService.recentActivity((0, params_1.numberParam)(req.query.limit, 10, 1, 100)) });
exports.activity = activity;
//# sourceMappingURL=analytics.controller.js.map