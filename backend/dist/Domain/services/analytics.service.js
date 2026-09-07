"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const analytics_repository_1 = require("../../Infrastructure/repositories/analytics.repository");
const prisma_1 = require("../../Infrastructure/prisma");
exports.analyticsService = {
    summary: () => analytics_repository_1.analyticsRepository.summary(),
    trends: async () => {
        const rows = await analytics_repository_1.analyticsRepository.trends();
        return rows.map((row) => ({ week: row.weekStartDate.toISOString().slice(0, 10), status: row.status, count: row._count._all }));
    },
    teamStatus: async () => {
        const users = await analytics_repository_1.analyticsRepository.teamStatus();
        return users.map((user) => ({ userId: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email, submitted: user.ownReports.filter((r) => r.status === 'submitted').length, approved: user.ownReports.filter((r) => r.status === 'approved').length, needsCorrection: user.ownReports.filter((r) => r.status === 'needs_correction').length, draft: user.ownReports.filter((r) => r.status === 'draft').length }));
    },
    workload: async () => {
        const rows = await analytics_repository_1.analyticsRepository.workload();
        const projects = await prisma_1.prisma.project.findMany({ select: { id: true, name: true } });
        return rows.map((row) => ({ name: projects.find((project) => project.id === row.projectId)?.name || 'Unassigned', value: row._count._all }));
    },
    taskTime: async () => (await analytics_repository_1.analyticsRepository.taskTime()).map((row) => ({ type: row.taskType, hours: Number(row._sum.hours || 0) })),
    activity: async () => (await analytics_repository_1.analyticsRepository.activity()).map((row) => ({ type: row.newStatus, reportId: row.report.id, teamMember: `${row.report.user.firstName} ${row.report.user.lastName}`, manager: row.reviewer ? `${row.reviewer.firstName} ${row.reviewer.lastName}` : null, weekStartDate: row.report.weekStartDate, timestamp: row.createdAt, comment: row.comment })),
};
//# sourceMappingURL=analytics.service.js.map