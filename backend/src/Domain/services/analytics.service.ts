import { analyticsRepository } from '../../Infrastructure/repositories/analytics.repository';

export const analyticsService = {
  teamSection: async (weekStart: Date, section: 'blockers' | 'achievements') => (await analyticsRepository.teamSection(weekStart, section)).map((member: any) => ({
    userId: member.id,
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    reports: member.reports_reports_userIdTousers.map((report: any) => ({
      reportId: report.id,
      projectName: report.projects?.name || 'No project',
      entries: section === 'blockers' ? report.report_blockers : report.report_achievements,
    })),
  })),
  summary: async (weekStart?: Date) => { const result = await analyticsRepository.summary(weekStart); return { ...result, reportsSubmitted: result.submittedCount, submittedReports: result.submittedCount, needsCorrection: result.needsCorrectionCount, complianceRate: result.totalReports ? Math.round((result.approvedCount / result.totalReports) * 100) : 0 }; },
  submissionByUser: async (weekStart?: Date) => (await analyticsRepository.submissionByUser(weekStart)).map((user: any) => { const reports = user.reports_reports_userIdTousers || []; const count = (status: string) => reports.filter((report: any) => report.status === status).length; const latest = [...reports].sort((a: any, b: any) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())[0]; return { userId: user.id, userName: `${user.firstName} ${user.lastName}`, name: `${user.firstName} ${user.lastName}`, submitted: count('submitted'), approved: count('approved'), needsCorrection: count('needs_correction'), lastSubmittedAt: latest?.submittedAt || null }; }),
  tasksTrend: async (start?: Date, end?: Date) => { const rows = await analyticsRepository.taskTrend(start, end); const byWeek = new Map<string, { completedCount: number; pendingCount: number }>(); rows.forEach((row: any) => { const week = row.createdAt?.toISOString().slice(0, 10) || 'unknown'; const item = byWeek.get(week) || { completedCount: 0, pendingCount: 0 }; row.status === 'completed' ? item.completedCount++ : item.pendingCount++; byWeek.set(week, item); }); return [...byWeek].map(([week, values]) => ({ week, completed: values.completedCount, pending: values.pendingCount, completedCount: values.completedCount, total: values.completedCount + values.pendingCount })); },
  workload: async () => (await analyticsRepository.workload()).map((project: any) => { const tasks = project.reports.flatMap((report: any) => report.report_tasks); const totalHours = tasks.reduce((sum: number, task: any) => sum + Number(task.timeSpentHours || task.timePlannedHours || 0), 0); return { projectId: project.id, projectName: project.name, name: project.name, totalTasks: tasks.length, totalHours, value: tasks.length, hours: totalHours }; }),
  timeByType: async () => { const rows = await analyticsRepository.timeByType(); const total = rows.reduce((sum: number, row: any) => sum + Number(row._sum.hours || 0), 0); return rows.map((row: any) => ({ taskType: row.taskType, totalHours: Number(row._sum.hours || 0), percentage: total ? Math.round(Number(row._sum.hours || 0) / total * 100) : 0 })); },
  recentActivity: async (limit: number) => (await analyticsRepository.recentActivity(limit)).map((activity: any) => ({
    type: activity.newStatus,
    reportId: activity.reports?.id || activity.reportId,
    teamMember: activity.reports?.users_reports_userIdTousers ? `${activity.reports.users_reports_userIdTousers.firstName} ${activity.reports.users_reports_userIdTousers.lastName}` : 'Team member',
    weekStartDate: activity.reports?.weekStartDate,
    timestamp: activity.createdAt,
    comment: activity.comment,
  })),
  blockers: async () => (await analyticsRepository.blockers()).map((blocker: any) => ({ blockerId: blocker.id, description: blocker.description, reportId: blocker.reportId, userName: `${blocker.reports.users_reports_userIdTousers.firstName} ${blocker.reports.users_reports_userIdTousers.lastName}`, daysOpen: Math.floor((Date.now() - new Date(blocker.createdAt || Date.now()).getTime()) / 86400000) })),
};
