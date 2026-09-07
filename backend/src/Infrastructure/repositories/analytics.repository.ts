import { prisma } from '../prisma';

export const analyticsRepository = {
  summary: async () => {
    const [totalReports, submittedReports, approvedReports, needsCorrection, openBlockers] = await Promise.all([
      prisma.report.count(), prisma.report.count({ where: { status: 'submitted' } }), prisma.report.count({ where: { status: 'approved' } }), prisma.report.count({ where: { status: 'needs_correction' } }), prisma.reportBlocker.count({ where: { isKeyIssue: true, resolution: null } }),
    ]);
    return { totalReports, submittedReports, approvedReports, needsCorrection, openBlockers, complianceRate: totalReports ? Math.round((approvedReports / totalReports) * 100) : 0 };
  },
  trends: () => prisma.report.groupBy({ by: ['weekStartDate', 'status'], _count: { _all: true }, orderBy: { weekStartDate: 'asc' } }),
  teamStatus: () => prisma.user.findMany({ where: { userRoles: { some: { role: { name: 'team_member' } } } }, select: { id: true, firstName: true, lastName: true, email: true, ownReports: { select: { status: true } } } }),
  workload: () => prisma.report.groupBy({ by: ['projectId'], _count: { _all: true } }),
  taskTime: () => prisma.reportTimeByTaskType.groupBy({ by: ['taskType'], _sum: { hours: true } }),
  activity: () => prisma.reportReviewHistory.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { report: { select: { id: true, weekStartDate: true, user: { select: { firstName: true, lastName: true } } } }, reviewer: { select: { firstName: true, lastName: true } } } }),
};
