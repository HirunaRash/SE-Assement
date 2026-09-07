import { reportRepository } from '../../Infrastructure/repositories/report.repository';

const toStatus = (value: string | undefined) => value?.toLowerCase().replace(' ', '_') || 'draft';
const access = (report: any, userId: number, roles: string[]) => {
  if (!report) throw new Error('Report not found');
  if (!roles.some((role) => ['manager', 'admin'].includes(role)) && report.userId !== userId) throw new Error('Access denied');
};

export const reportService = {
  getById: async (id: number, userId: number, roles: string[]) => { const report = await reportRepository.findById(id); access(report, userId, roles); return report; },
  list: (userId: number, roles: string[], filters: any) => roles.some((role) => ['manager', 'admin'].includes(role)) ? reportRepository.findAll(filters) : reportRepository.findByUser(userId),
  create: async (userId: number, data: any) => reportRepository.create({ userId, weekStartDate: new Date(data.weekStartDate), weekEndDate: new Date(data.weekEndDate), projectId: data.projectId ? Number(data.projectId) : null, status: toStatus(data.status) }),
  update: async (id: number, userId: number, roles: string[], data: any) => {
    const report = await reportRepository.findById(id); access(report, userId, roles);
    if (!['draft', 'needs_correction'].includes(String(report!.status))) throw new Error('Only draft or correction reports can be edited');
    return reportRepository.update(id, { weekStartDate: data.weekStartDate ? new Date(data.weekStartDate) : undefined, weekEndDate: data.weekEndDate ? new Date(data.weekEndDate) : undefined, projectId: data.projectId, status: data.status ? toStatus(data.status) : undefined });
  },
  submit: async (id: number, userId: number, roles: string[]) => {
    const report = await reportRepository.findById(id); access(report, userId, roles);
    const nextVersion = ((report as any).versions?.[0]?.versionNumber || 0) + 1;
    await reportRepository.createVersion({ reportId: id, versionNumber: nextVersion, submittedAt: new Date(), submittedBy: userId, status: 'submitted' });
    return reportRepository.update(id, { status: 'submitted', submittedAt: new Date() });
  },
  review: async (id: number, reviewerId: number, action: 'approved' | 'needs_correction', comment?: string) => {
    const report = await reportRepository.findById(id); if (!report) throw new Error('Report not found');
    const previousStatus = report.status || 'draft';
    await reportRepository.createReview({ reportId: id, reviewedBy: reviewerId, previousStatus, newStatus: action, comment: comment || null });
    return reportRepository.update(id, { status: action, lastReviewComment: comment || null, lastReviewedBy: reviewerId, lastReviewedAt: new Date(), approvedAt: action === 'approved' ? new Date() : null });
  },
  addTask: (reportId: number, userId: number, roles: string[], data: any) => reportService.getById(reportId, userId, roles).then(() => reportRepository.addTask({ reportId, taskName: data.taskName, priority: data.priority, plannedPercentage: data.plannedPercentage, actualPercentage: data.actualPercentage, status: data.status, timePlannedHours: data.timePlannedHours, timeSpentHours: data.timeSpentHours, deliverable: data.deliverable })),
  updateTask: (id: number, data: any) => reportRepository.updateTask(id, data),
  deleteTask: (id: number) => reportRepository.deleteTask(id),
};
