import { prisma } from '../../prisma';
import { reportRepository } from '../../Infrastructure/repositories/report.repository';

const owner = async (id: number, userId: number, manager = false) => { const report: any = await reportRepository.findById(id); if (!report) throw Object.assign(new Error('Report not found'), { statusCode: 404 }); if (manager && report.status === 'draft') throw Object.assign(new Error('Draft reports are not available for manager review'), { statusCode: 404 }); if (!manager && report.userId !== userId) throw Object.assign(new Error('Access denied'), { statusCode: 403 }); return report; };
const editable = (report: any) => { if (!['draft', 'needs_correction'].includes(report.status)) throw Object.assign(new Error('Only draft or needs_correction reports can be edited'), { statusCode: 409 }); };
const dates = (value: any) => { const date = new Date(value); if (Number.isNaN(date.getTime())) throw Object.assign(new Error('Invalid date'), { statusCode: 400 }); return date; };

export const reportService = {
  listMine: async (userId: number, status: string | undefined, skip: number, take: number, startDate?: string, endDate?: string) => {
    const where: any = { ...(status ? { status: status.toLowerCase() } : {}) };
    if (startDate) where.weekStartDate = { ...(where.weekStartDate || {}), gte: dates(startDate) };
    if (endDate) where.weekEndDate = { ...(where.weekEndDate || {}), lte: dates(endDate) };
    return { items: await reportRepository.findMine(userId, where, skip, take), total: await reportRepository.count({ userId, ...where }) };
  },
  listAll: async (filters: any, skip: number, take: number) => {
    const requestedStatus = typeof filters.status === 'string' ? filters.status.toLowerCase() : undefined;
    if (requestedStatus === 'draft') return { items: [], total: 0 };
    const where: any = { status: requestedStatus || { not: 'draft' } };
    if (filters.projectId) where.projectId = Number(filters.projectId);
    if (filters.userId) where.userId = Number(filters.userId);
    if (filters.weekStart) where.weekStartDate = { ...(where.weekStartDate || {}), gte: dates(filters.weekStart) };
    if (filters.weekEnd) where.weekEndDate = { ...(where.weekEndDate || {}), lte: dates(filters.weekEnd) };
    if (filters.startDate) where.weekStartDate = { ...(where.weekStartDate || {}), gte: dates(filters.startDate) };
    if (filters.endDate) where.weekEndDate = { ...(where.weekEndDate || {}), lte: dates(filters.endDate) };
    return { items: await reportRepository.findAll(where, skip, take), total: await reportRepository.count(where) };
  },
  get: (id: number, userId: number, manager: boolean) => owner(id, userId, manager),
  create: async (userId: number, data: any) => reportRepository.create({ userId, weekStartDate: dates(data.weekStartDate), weekEndDate: dates(data.weekEndDate), projectId: data.projectId ? Number(data.projectId) : null, status: 'draft' }),
  update: async (id: number, userId: number, data: any) => {
    const report: any = await owner(id, userId);
    editable(report);
    const scalar = { weekStartDate: data.weekStartDate ? dates(data.weekStartDate) : undefined, weekEndDate: data.weekEndDate ? dates(data.weekEndDate) : undefined, projectId: data.projectId === undefined ? undefined : data.projectId ? Number(data.projectId) : null };
    await prisma.$transaction(async (tx: any) => {
      await tx.reports.update({ where: { id }, data: scalar });
      const collections = [
        ['report_tasks', data.tasks, (item: any) => ({ reportId: id, taskName: item.taskName, priority: item.priority, plannedPercentage: item.plannedPercent ?? item.plannedPercentage, actualPercentage: item.actualPercent ?? item.actualPercentage, status: item.status, timePlannedHours: item.plannedHours ?? item.timePlannedHours, timeSpentHours: item.spentHours ?? item.timeSpentHours, deliverable: item.deliverable })],
        ['report_blockers', data.blockers, (item: any) => ({ reportId: id, description: item.description, isKeyIssue: item.isKeyIssue })],
        ['report_achievements', data.achievements, (item: any) => ({ reportId: id, description: item.description, isKeyAchievement: item.isKeyAchievement })],
        ['report_next_week_tasks', data.nextWeekTasks, (item: any) => ({ reportId: id, taskName: item.taskName, priority: item.priority, estimatedHours: item.estimatedHours })],
        ['report_time_by_task_type', data.timeByType || data.timeByTaskType, (item: any) => ({ reportId: id, taskType: item.taskType, hours: item.hours })],
      ];
      for (const [table, items, map] of collections) {
        if (!Array.isArray(items)) continue;
        await tx[table].deleteMany({ where: { reportId: id } });
        if (items.length) await tx[table].createMany({ data: items.map(map) });
      }
      if (data.optionalFields) await tx.report_optional_fields.upsert({ where: { id: report.report_optional_fields[0]?.id || -id }, create: { reportId: id, ...data.optionalFields }, update: data.optionalFields });
    });
    return reportRepository.findById(id);
  },
  submit: async (id: number, userId: number) => { const report: any = await owner(id, userId); editable(report); const version = (report.report_versions[0]?.versionNumber || 0) + 1; await reportRepository.version({ reportId: id, versionNumber: version, submittedAt: new Date(), submittedBy: userId, status: 'submitted', report_version_tasks: { create: report.report_tasks.map((task: any) => ({ taskName: task.taskName, priority: task.priority, plannedPercentage: task.plannedPercentage, actualPercentage: task.actualPercentage, status: task.status, timePlannedHours: task.timePlannedHours, timeSpentHours: task.timeSpentHours, deliverable: task.deliverable })) } }); await reportRepository.update(id, { status: 'submitted', submittedAt: new Date() }); return { status: 'submitted' }; },
  addTask: async (id: number, userId: number, data: any) => { const report: any = await owner(id, userId); editable(report); return reportRepository.task({ reportId: id, taskName: data.taskName, priority: data.priority, plannedPercentage: data.plannedPercent ?? data.plannedPercentage, actualPercentage: data.actualPercent ?? data.actualPercentage, status: data.status, timePlannedHours: data.plannedHours ?? data.timePlannedHours, timeSpentHours: data.spentHours ?? data.timeSpentHours, deliverable: data.deliverable }); },
  updateTask: async (id: number, taskId: number, userId: number, data: any) => { const report: any = await owner(id, userId); editable(report); if (!report.report_tasks.some((task: any) => task.id === taskId)) throw Object.assign(new Error('Task not found'), { statusCode: 404 }); return reportRepository.updateTask(taskId, data); },
  deleteTask: async (id: number, taskId: number, userId: number) => { const report: any = await owner(id, userId); editable(report); if (!report.report_tasks.some((task: any) => task.id === taskId)) throw Object.assign(new Error('Task not found'), { statusCode: 404 }); await reportRepository.deleteTask(taskId); },
  child: async (kind: string, id: number, userId: number, data: any, childId?: number) => { const report: any = await owner(id, userId); editable(report); const map: any = { blockers: ['report_blockers', 'blocker', 'updateBlocker', 'deleteBlocker'], achievements: ['report_achievements', 'achievement', 'updateAchievement', 'deleteAchievement'], 'next-week-tasks': ['report_next_week_tasks', 'nextTask', 'updateNextTask', 'deleteNextTask'] }; const config = map[kind]; if (!config) throw Object.assign(new Error('Unsupported child resource'), { statusCode: 400 }); if (childId) return (reportRepository as any)[config[2]](childId, data); return (reportRepository as any)[config[1]]({ reportId: id, ...data }); },
  deleteChild: async (kind: string, id: number, userId: number, childId: number) => { await owner(id, userId); const map: any = { blockers: 'deleteBlocker', achievements: 'deleteAchievement', 'next-week-tasks': 'deleteNextTask' }; await (reportRepository as any)[map[kind]](childId); },
  addTime: async (id: number, userId: number, data: any) => { const report: any = await owner(id, userId); editable(report); return reportRepository.time({ reportId: id, taskType: data.taskType, hours: data.hours }); },
  review: async (id: number, reviewerId: number, status: 'approved' | 'needs_correction', comment?: string) => { const report: any = await owner(id, reviewerId, true); if (report.status !== 'submitted') throw Object.assign(new Error('Only submitted reports can be reviewed'), { statusCode: 409 }); await reportRepository.review({ reportId: id, reviewedBy: reviewerId, previousStatus: report.status, newStatus: status, comment: comment || null }); await reportRepository.update(id, { status, lastReviewComment: comment || null, lastReviewedBy: reviewerId, lastReviewedAt: new Date(), approvedAt: status === 'approved' ? new Date() : null }); return { status, ...(comment ? { comment } : {}) }; },
  versions: async (id: number, userId: number, manager: boolean) => { await owner(id, userId, manager); return reportRepository.versions(id); },
  version: async (id: number, version: number, userId: number, manager: boolean) => { await owner(id, userId, manager); return reportRepository.versionByNumber(id, version); },
  history: (id: number) => reportRepository.reviewHistory(id),
};
