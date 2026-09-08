"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const prisma_1 = require("../../prisma");
const report_repository_1 = require("../../Infrastructure/repositories/report.repository");
const project_repository_1 = require("../../Infrastructure/repositories/project.repository");
const owner = async (id, userId, manager = false) => { const report = await report_repository_1.reportRepository.findById(id); if (!report)
    throw Object.assign(new Error('Report not found'), { statusCode: 404 }); if (manager && report.status === 'draft')
    throw Object.assign(new Error('Draft reports are not available for manager review'), { statusCode: 404 }); if (!manager && report.userId !== userId)
    throw Object.assign(new Error('Access denied'), { statusCode: 403 }); return report; };
const editable = (report) => { if (!['draft', 'needs_correction'].includes(report.status))
    throw Object.assign(new Error('Only draft or needs_correction reports can be edited'), { statusCode: 409 }); };
const dates = (value) => { const date = new Date(value); if (Number.isNaN(date.getTime()))
    throw Object.assign(new Error('Invalid date'), { statusCode: 400 }); return date; };
exports.reportService = {
    listMine: async (userId, status, skip, take, startDate, endDate) => {
        const where = { ...(status ? { status: status.toLowerCase() } : {}) };
        if (startDate)
            where.weekStartDate = { ...(where.weekStartDate || {}), gte: dates(startDate) };
        if (endDate)
            where.weekEndDate = { ...(where.weekEndDate || {}), lte: dates(endDate) };
        return { items: await report_repository_1.reportRepository.findMine(userId, where, skip, take), total: await report_repository_1.reportRepository.count({ userId, ...where }) };
    },
    listAll: async (filters, skip, take) => {
        const requestedStatus = typeof filters.status === 'string' ? filters.status.toLowerCase() : undefined;
        if (requestedStatus === 'draft')
            return { items: [], total: 0 };
        const where = { status: requestedStatus || { not: 'draft' } };
        if (filters.projectId)
            where.projectId = Number(filters.projectId);
        if (filters.userId)
            where.userId = Number(filters.userId);
        if (filters.weekStart)
            where.weekStartDate = { ...(where.weekStartDate || {}), gte: dates(filters.weekStart) };
        if (filters.weekEnd)
            where.weekEndDate = { ...(where.weekEndDate || {}), lte: dates(filters.weekEnd) };
        if (filters.startDate)
            where.weekStartDate = { ...(where.weekStartDate || {}), gte: dates(filters.startDate) };
        if (filters.endDate)
            where.weekEndDate = { ...(where.weekEndDate || {}), lte: dates(filters.endDate) };
        return { items: await report_repository_1.reportRepository.findAll(where, skip, take), total: await report_repository_1.reportRepository.count(where) };
    },
    get: (id, userId, manager) => owner(id, userId, manager),
    create: async (userId, data) => {
        const projectId = data.projectId ? Number(data.projectId) : null;
        if (projectId && !await project_repository_1.projectRepository.memberExists(projectId, userId))
            throw Object.assign(new Error('You can only create reports for projects assigned to you'), { statusCode: 403 });
        return report_repository_1.reportRepository.create({ userId, weekStartDate: dates(data.weekStartDate), weekEndDate: dates(data.weekEndDate), projectId, status: 'draft' });
    },
    update: async (id, userId, data) => {
        const report = await owner(id, userId);
        editable(report);
        if (data.projectId !== undefined && data.projectId !== null && !await project_repository_1.projectRepository.memberExists(Number(data.projectId), userId))
            throw Object.assign(new Error('You can only use projects assigned to you'), { statusCode: 403 });
        const scalar = { weekStartDate: data.weekStartDate ? dates(data.weekStartDate) : undefined, weekEndDate: data.weekEndDate ? dates(data.weekEndDate) : undefined, projectId: data.projectId === undefined ? undefined : data.projectId ? Number(data.projectId) : null };
        await prisma_1.prisma.$transaction(async (tx) => {
            await tx.reports.update({ where: { id }, data: scalar });
            const collections = [
                ['report_tasks', data.tasks, (item) => ({ reportId: id, taskName: item.taskName, priority: item.priority, plannedPercentage: item.plannedPercent ?? item.plannedPercentage, actualPercentage: item.actualPercent ?? item.actualPercentage, status: item.status, timePlannedHours: item.plannedHours ?? item.timePlannedHours, timeSpentHours: item.spentHours ?? item.timeSpentHours, deliverable: item.deliverable })],
                ['report_blockers', data.blockers, (item) => ({ reportId: id, description: item.description, isKeyIssue: item.isKeyIssue })],
                ['report_achievements', data.achievements, (item) => ({ reportId: id, description: item.description, isKeyAchievement: item.isKeyAchievement })],
                ['report_next_week_tasks', data.nextWeekTasks, (item) => ({ reportId: id, taskName: item.taskName, priority: item.priority, estimatedHours: item.estimatedHours })],
                ['report_time_by_task_type', data.timeByType || data.timeByTaskType, (item) => ({ reportId: id, taskType: item.taskType, hours: item.hours })],
            ];
            for (const [table, items, map] of collections) {
                if (!Array.isArray(items))
                    continue;
                await tx[table].deleteMany({ where: { reportId: id } });
                if (items.length)
                    await tx[table].createMany({ data: items.map(map) });
            }
            if (data.optionalFields)
                await tx.report_optional_fields.upsert({ where: { id: report.report_optional_fields[0]?.id || -id }, create: { reportId: id, ...data.optionalFields }, update: data.optionalFields });
        });
        return report_repository_1.reportRepository.findById(id);
    },
    submit: async (id, userId) => { const report = await owner(id, userId); editable(report); const version = (report.report_versions[0]?.versionNumber || 0) + 1; await report_repository_1.reportRepository.version({ reportId: id, versionNumber: version, submittedAt: new Date(), submittedBy: userId, status: 'submitted', report_version_tasks: { create: report.report_tasks.map((task) => ({ taskName: task.taskName, priority: task.priority, plannedPercentage: task.plannedPercentage, actualPercentage: task.actualPercentage, status: task.status, timePlannedHours: task.timePlannedHours, timeSpentHours: task.timeSpentHours, deliverable: task.deliverable })) } }); await report_repository_1.reportRepository.update(id, { status: 'submitted', submittedAt: new Date() }); return { status: 'submitted' }; },
    addTask: async (id, userId, data) => { const report = await owner(id, userId); editable(report); return report_repository_1.reportRepository.task({ reportId: id, taskName: data.taskName, priority: data.priority, plannedPercentage: data.plannedPercent ?? data.plannedPercentage, actualPercentage: data.actualPercent ?? data.actualPercentage, status: data.status, timePlannedHours: data.plannedHours ?? data.timePlannedHours, timeSpentHours: data.spentHours ?? data.timeSpentHours, deliverable: data.deliverable }); },
    updateTask: async (id, taskId, userId, data) => { const report = await owner(id, userId); editable(report); if (!report.report_tasks.some((task) => task.id === taskId))
        throw Object.assign(new Error('Task not found'), { statusCode: 404 }); return report_repository_1.reportRepository.updateTask(taskId, data); },
    deleteTask: async (id, taskId, userId) => { const report = await owner(id, userId); editable(report); if (!report.report_tasks.some((task) => task.id === taskId))
        throw Object.assign(new Error('Task not found'), { statusCode: 404 }); await report_repository_1.reportRepository.deleteTask(taskId); },
    child: async (kind, id, userId, data, childId) => { const report = await owner(id, userId); editable(report); const map = { blockers: ['report_blockers', 'blocker', 'updateBlocker', 'deleteBlocker'], achievements: ['report_achievements', 'achievement', 'updateAchievement', 'deleteAchievement'], 'next-week-tasks': ['report_next_week_tasks', 'nextTask', 'updateNextTask', 'deleteNextTask'] }; const config = map[kind]; if (!config)
        throw Object.assign(new Error('Unsupported child resource'), { statusCode: 400 }); if (childId)
        return report_repository_1.reportRepository[config[2]](childId, data); return report_repository_1.reportRepository[config[1]]({ reportId: id, ...data }); },
    deleteChild: async (kind, id, userId, childId) => { await owner(id, userId); const map = { blockers: 'deleteBlocker', achievements: 'deleteAchievement', 'next-week-tasks': 'deleteNextTask' }; await report_repository_1.reportRepository[map[kind]](childId); },
    addTime: async (id, userId, data) => { const report = await owner(id, userId); editable(report); return report_repository_1.reportRepository.time({ reportId: id, taskType: data.taskType, hours: data.hours }); },
    review: async (id, reviewerId, status, comment) => { const report = await owner(id, reviewerId, true); if (report.status !== 'submitted')
        throw Object.assign(new Error('Only submitted reports can be reviewed'), { statusCode: 409 }); await report_repository_1.reportRepository.review({ reportId: id, reviewedBy: reviewerId, previousStatus: report.status, newStatus: status, comment: comment || null }); await report_repository_1.reportRepository.update(id, { status, lastReviewComment: comment || null, lastReviewedBy: reviewerId, lastReviewedAt: new Date(), approvedAt: status === 'approved' ? new Date() : null }); return { status, ...(comment ? { comment } : {}) }; },
    versions: async (id, userId, manager) => { await owner(id, userId, manager); return report_repository_1.reportRepository.versions(id); },
    version: async (id, version, userId, manager) => { await owner(id, userId, manager); return report_repository_1.reportRepository.versionByNumber(id, version); },
    history: (id) => report_repository_1.reportRepository.reviewHistory(id),
};
//# sourceMappingURL=report.service.js.map