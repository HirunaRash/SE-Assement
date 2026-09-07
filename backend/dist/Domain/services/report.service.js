"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const report_repository_1 = require("../../Infrastructure/repositories/report.repository");
const toStatus = (value) => value?.toLowerCase().replace(' ', '_') || 'draft';
const access = (report, userId, roles) => {
    if (!report)
        throw new Error('Report not found');
    if (!roles.some((role) => ['manager', 'admin'].includes(role)) && report.userId !== userId)
        throw new Error('Access denied');
};
exports.reportService = {
    getById: async (id, userId, roles) => { const report = await report_repository_1.reportRepository.findById(id); access(report, userId, roles); return report; },
    list: (userId, roles, filters) => roles.some((role) => ['manager', 'admin'].includes(role)) ? report_repository_1.reportRepository.findAll(filters) : report_repository_1.reportRepository.findByUser(userId),
    create: async (userId, data) => report_repository_1.reportRepository.create({ userId, weekStartDate: new Date(data.weekStartDate), weekEndDate: new Date(data.weekEndDate), projectId: data.projectId ? Number(data.projectId) : null, status: toStatus(data.status) }),
    update: async (id, userId, roles, data) => {
        const report = await report_repository_1.reportRepository.findById(id);
        access(report, userId, roles);
        if (!['draft', 'needs_correction'].includes(String(report.status)))
            throw new Error('Only draft or correction reports can be edited');
        return report_repository_1.reportRepository.update(id, { weekStartDate: data.weekStartDate ? new Date(data.weekStartDate) : undefined, weekEndDate: data.weekEndDate ? new Date(data.weekEndDate) : undefined, projectId: data.projectId, status: data.status ? toStatus(data.status) : undefined });
    },
    submit: async (id, userId, roles) => {
        const report = await report_repository_1.reportRepository.findById(id);
        access(report, userId, roles);
        const nextVersion = (report.versions?.[0]?.versionNumber || 0) + 1;
        await report_repository_1.reportRepository.createVersion({ reportId: id, versionNumber: nextVersion, submittedAt: new Date(), submittedBy: userId, status: 'submitted' });
        return report_repository_1.reportRepository.update(id, { status: 'submitted', submittedAt: new Date() });
    },
    review: async (id, reviewerId, action, comment) => {
        const report = await report_repository_1.reportRepository.findById(id);
        if (!report)
            throw new Error('Report not found');
        const previousStatus = report.status || 'draft';
        await report_repository_1.reportRepository.createReview({ reportId: id, reviewedBy: reviewerId, previousStatus, newStatus: action, comment: comment || null });
        return report_repository_1.reportRepository.update(id, { status: action, lastReviewComment: comment || null, lastReviewedBy: reviewerId, lastReviewedAt: new Date(), approvedAt: action === 'approved' ? new Date() : null });
    },
    addTask: (reportId, userId, roles, data) => exports.reportService.getById(reportId, userId, roles).then(() => report_repository_1.reportRepository.addTask({ reportId, taskName: data.taskName, priority: data.priority, plannedPercentage: data.plannedPercentage, actualPercentage: data.actualPercentage, status: data.status, timePlannedHours: data.timePlannedHours, timeSpentHours: data.timeSpentHours, deliverable: data.deliverable })),
    updateTask: (id, data) => report_repository_1.reportRepository.updateTask(id, data),
    deleteTask: (id) => report_repository_1.reportRepository.deleteTask(id),
};
//# sourceMappingURL=report.service.js.map