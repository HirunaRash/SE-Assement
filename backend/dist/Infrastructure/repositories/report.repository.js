"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRepository = void 0;
const prisma_1 = require("../../prisma");
const fullInclude = {
    projects: true,
    users_reports_userIdTousers: { select: { id: true, email: true, firstName: true, lastName: true } },
    report_tasks: true,
    report_blockers: true,
    report_achievements: true,
    report_next_week_tasks: true,
    report_time_by_task_type: true,
    report_optional_fields: true,
    report_review_history: { include: { users: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } },
    report_versions: { include: { report_version_tasks: true }, orderBy: { versionNumber: 'desc' } },
};
exports.reportRepository = {
    findById: (id) => prisma_1.prisma.reports.findUnique({ where: { id }, include: fullInclude }),
    findMine: (userId, where, skip, take) => prisma_1.prisma.reports.findMany({ where: { userId, ...where }, skip, take, orderBy: { weekStartDate: 'desc' }, include: { projects: true } }),
    findAll: (where, skip, take) => prisma_1.prisma.reports.findMany({ where: { status: { not: 'draft' }, ...where }, skip, take, orderBy: { weekStartDate: 'desc' }, include: { projects: true, users_reports_userIdTousers: { select: { id: true, firstName: true, lastName: true } } } }),
    count: (where) => prisma_1.prisma.reports.count({ where }),
    create: (data) => prisma_1.prisma.reports.create({ data, include: fullInclude }),
    update: (id, data) => prisma_1.prisma.reports.update({ where: { id }, data, include: fullInclude }),
    task: (data) => prisma_1.prisma.report_tasks.create({ data }),
    updateTask: (id, data) => prisma_1.prisma.report_tasks.update({ where: { id }, data }),
    deleteTask: (id) => prisma_1.prisma.report_tasks.delete({ where: { id } }),
    blocker: (data) => prisma_1.prisma.report_blockers.create({ data }),
    updateBlocker: (id, data) => prisma_1.prisma.report_blockers.update({ where: { id }, data }),
    deleteBlocker: (id) => prisma_1.prisma.report_blockers.delete({ where: { id } }),
    achievement: (data) => prisma_1.prisma.report_achievements.create({ data }),
    updateAchievement: (id, data) => prisma_1.prisma.report_achievements.update({ where: { id }, data }),
    deleteAchievement: (id) => prisma_1.prisma.report_achievements.delete({ where: { id } }),
    nextTask: (data) => prisma_1.prisma.report_next_week_tasks.create({ data }),
    updateNextTask: (id, data) => prisma_1.prisma.report_next_week_tasks.update({ where: { id }, data }),
    deleteNextTask: (id) => prisma_1.prisma.report_next_week_tasks.delete({ where: { id } }),
    time: (data) => prisma_1.prisma.report_time_by_task_type.create({ data }),
    version: (data) => prisma_1.prisma.report_versions.create({ data, include: { report_version_tasks: true } }),
    versions: (reportId) => prisma_1.prisma.report_versions.findMany({ where: { reportId }, include: { report_version_tasks: true }, orderBy: { versionNumber: 'desc' } }),
    versionByNumber: (reportId, versionNumber) => prisma_1.prisma.report_versions.findUnique({ where: { reportId_versionNumber: { reportId, versionNumber } }, include: { report_version_tasks: true } }),
    reviewHistory: (reportId) => prisma_1.prisma.report_review_history.findMany({ where: { reportId }, include: { users: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
    review: (data) => prisma_1.prisma.report_review_history.create({ data }),
};
//# sourceMappingURL=report.repository.js.map