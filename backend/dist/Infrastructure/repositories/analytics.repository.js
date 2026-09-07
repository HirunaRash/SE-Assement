"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRepository = void 0;
const prisma_1 = require("../../prisma");
exports.analyticsRepository = {
    summary: async (weekStart) => {
        const where = weekStart ? { weekStartDate: weekStart } : {};
        const [totalReports, submittedCount, approvedCount, needsCorrectionCount, openBlockersCount] = await Promise.all([
            prisma_1.prisma.reports.count({ where }),
            prisma_1.prisma.reports.count({ where: { ...where, status: 'submitted' } }),
            prisma_1.prisma.reports.count({ where: { ...where, status: 'approved' } }),
            prisma_1.prisma.reports.count({ where: { ...where, status: 'needs_correction' } }),
            prisma_1.prisma.report_blockers.count({ where: { reports: { ...where, status: { not: 'approved' } } } }),
        ]);
        return { totalReports, submittedCount, approvedCount, needsCorrectionCount, openBlockersCount };
    },
    submissionByUser: (weekStart) => prisma_1.prisma.users.findMany({ select: { id: true, firstName: true, lastName: true, reports_reports_userIdTousers: { where: weekStart ? { weekStartDate: weekStart } : {}, orderBy: { submittedAt: 'desc' }, take: 1, select: { status: true, submittedAt: true } } } }),
    taskTrend: (startDate, endDate) => prisma_1.prisma.report_tasks.findMany({ where: { createdAt: { gte: startDate, lte: endDate } }, select: { status: true, createdAt: true } }),
    workload: () => prisma_1.prisma.projects.findMany({ select: { id: true, name: true, reports: { select: { report_tasks: { select: { status: true, timePlannedHours: true, timeSpentHours: true } } } } } }),
    timeByType: () => prisma_1.prisma.report_time_by_task_type.groupBy({ by: ['taskType'], _sum: { hours: true } }),
    recentActivity: (limit) => prisma_1.prisma.report_review_history.findMany({ take: limit, orderBy: { createdAt: 'desc' }, include: { users: { select: { firstName: true, lastName: true } }, reports: { select: { id: true } } } }),
    blockers: () => prisma_1.prisma.report_blockers.findMany({ where: { reports: { status: { not: 'approved' } } }, include: { reports: { include: { users_reports_userIdTousers: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'asc' } }),
};
//# sourceMappingURL=analytics.repository.js.map