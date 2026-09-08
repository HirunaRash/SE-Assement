import { prisma } from '../../prisma';

export const analyticsRepository = {
  teamSection: (weekStart: Date, section: 'blockers' | 'achievements') => prisma.users.findMany({
    where: { user_roles_user_roles_userIdTousers: { some: { roles: { name: 'team_member' } } } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      reports_reports_userIdTousers: {
        where: { weekStartDate: weekStart },
        select: {
          id: true,
          weekStartDate: true,
          projects: { select: { name: true } },
          report_blockers: { select: { id: true, description: true, isKeyIssue: true } },
          report_achievements: { select: { id: true, description: true, isKeyAchievement: true } },
        },
      },
    },
  }),
  summary: async (weekStart?: Date) => {
    const where = weekStart ? { weekStartDate: weekStart } : {};
    const [totalReports, submittedCount, approvedCount, needsCorrectionCount, openBlockersCount] = await Promise.all([
      prisma.reports.count({ where }),
      prisma.reports.count({ where: { ...where, status: 'submitted' } }),
      prisma.reports.count({ where: { ...where, status: 'approved' } }),
      prisma.reports.count({ where: { ...where, status: 'needs_correction' } }),
      prisma.report_blockers.count({ where: { reports: { ...where, status: { not: 'approved' } } } }),
    ]);
    return { totalReports, submittedCount, approvedCount, needsCorrectionCount, openBlockersCount };
  },
  submissionByUser: (weekStart?: Date) => prisma.users.findMany({ where: { user_roles_user_roles_userIdTousers: { some: { roles: { name: 'team_member' } } } }, select: { id: true, firstName: true, lastName: true, reports_reports_userIdTousers: { where: weekStart ? { weekStartDate: weekStart } : {}, select: { status: true, submittedAt: true } } } }),
  taskTrend: (startDate?: Date, endDate?: Date) => prisma.report_tasks.findMany({ where: { createdAt: { gte: startDate, lte: endDate } }, select: { status: true, createdAt: true } }),
  workload: () => prisma.projects.findMany({ select: { id: true, name: true, reports: { select: { report_tasks: { select: { status: true, timePlannedHours: true, timeSpentHours: true } } } } } }),
  timeByType: () => prisma.report_time_by_task_type.groupBy({ by: ['taskType'], _sum: { hours: true } }),
  recentActivity: (limit: number) => prisma.report_review_history.findMany({ take: limit, orderBy: { createdAt: 'desc' }, include: { users: { select: { firstName: true, lastName: true } }, reports: { select: { id: true, weekStartDate: true, users_reports_userIdTousers: { select: { firstName: true, lastName: true } } } } } }),
  blockers: () => prisma.report_blockers.findMany({ where: { reports: { status: { not: 'approved' } } }, include: { reports: { include: { users_reports_userIdTousers: { select: { firstName: true, lastName: true } } } } }, orderBy: { createdAt: 'asc' } }),
};
