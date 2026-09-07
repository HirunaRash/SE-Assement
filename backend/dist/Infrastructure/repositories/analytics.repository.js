"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRepository = void 0;
const prisma_1 = require("../prisma");
exports.analyticsRepository = {
    summary: async () => {
        const [totalReports, submittedReports, approvedReports, needsCorrection, openBlockers] = await Promise.all([
            prisma_1.prisma.report.count(), prisma_1.prisma.report.count({ where: { status: 'submitted' } }), prisma_1.prisma.report.count({ where: { status: 'approved' } }), prisma_1.prisma.report.count({ where: { status: 'needs_correction' } }), prisma_1.prisma.reportBlocker.count({ where: { isKeyIssue: true, resolution: null } }),
        ]);
        return { totalReports, submittedReports, approvedReports, needsCorrection, openBlockers, complianceRate: totalReports ? Math.round((approvedReports / totalReports) * 100) : 0 };
    },
    trends: () => prisma_1.prisma.report.groupBy({ by: ['weekStartDate', 'status'], _count: { _all: true }, orderBy: { weekStartDate: 'asc' } }),
    teamStatus: () => prisma_1.prisma.user.findMany({ where: { userRoles: { some: { role: { name: 'team_member' } } } }, select: { id: true, firstName: true, lastName: true, email: true, ownReports: { select: { status: true } } } }),
    workload: () => prisma_1.prisma.report.groupBy({ by: ['projectId'], _count: { _all: true } }),
    taskTime: () => prisma_1.prisma.reportTimeByTaskType.groupBy({ by: ['taskType'], _sum: { hours: true } }),
    activity: () => prisma_1.prisma.reportReviewHistory.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { report: { select: { id: true, weekStartDate: true, user: { select: { firstName: true, lastName: true } } } }, reviewer: { select: { firstName: true, lastName: true } } } }),
};
//# sourceMappingURL=analytics.repository.js.map