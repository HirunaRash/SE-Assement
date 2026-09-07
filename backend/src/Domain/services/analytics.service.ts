import { analyticsRepository } from '../../Infrastructure/repositories/analytics.repository';
import { prisma } from '../../Infrastructure/prisma';

export const analyticsService = {
  summary: () => analyticsRepository.summary(),
  trends: async () => {
    const rows = await analyticsRepository.trends();
    return rows.map((row: any) => ({ week: row.weekStartDate.toISOString().slice(0, 10), status: row.status, count: row._count._all }));
  },
  teamStatus: async () => {
    const users = await analyticsRepository.teamStatus();
    return users.map((user: any) => ({ userId: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email, submitted: user.ownReports.filter((r: any) => r.status === 'submitted').length, approved: user.ownReports.filter((r: any) => r.status === 'approved').length, needsCorrection: user.ownReports.filter((r: any) => r.status === 'needs_correction').length, draft: user.ownReports.filter((r: any) => r.status === 'draft').length }));
  },
  workload: async () => {
    const rows = await analyticsRepository.workload();
    const projects = await prisma.project.findMany({ select: { id: true, name: true } });
    return rows.map((row: any) => ({ name: projects.find((project: { id: number; name: string }) => project.id === row.projectId)?.name || 'Unassigned', value: row._count._all }));
  },
  taskTime: async () => (await analyticsRepository.taskTime()).map((row: any) => ({ type: row.taskType, hours: Number(row._sum.hours || 0) })),
  activity: async () => (await analyticsRepository.activity()).map((row: any) => ({ type: row.newStatus, reportId: row.report.id, teamMember: `${row.report.user.firstName} ${row.report.user.lastName}`, manager: row.reviewer ? `${row.reviewer.firstName} ${row.reviewer.lastName}` : null, weekStartDate: row.report.weekStartDate, timestamp: row.createdAt, comment: row.comment })),
};
