"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRepository = void 0;
const prisma_1 = require("../prisma");
const reportInclude = {
    project: true,
    user: { select: { id: true, firstName: true, lastName: true, email: true } },
    tasks: true,
    blockers: true,
    achievements: true,
    nextWeekTasks: true,
    timeByType: true,
    optionalFields: true,
    reviewHistory: { include: { reviewer: { select: { id: true, firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: 'desc' } },
    versions: { include: { tasks: true }, orderBy: { versionNumber: 'desc' } },
};
exports.reportRepository = {
    findById: (id) => prisma_1.prisma.report.findUnique({ where: { id }, include: reportInclude }),
    findByUser: (userId) => prisma_1.prisma.report.findMany({ where: { userId }, include: reportInclude, orderBy: { weekStartDate: 'desc' } }),
    findAll: (filters) => prisma_1.prisma.report.findMany({ where: { ...(filters.status ? { status: filters.status } : {}), ...(filters.userId ? { userId: filters.userId } : {}), ...(filters.startDate && filters.endDate ? { weekStartDate: { gte: filters.startDate, lte: filters.endDate } } : {}) }, include: reportInclude, orderBy: { weekStartDate: 'desc' } }),
    create: (data) => prisma_1.prisma.report.create({ data }),
    update: (id, data) => prisma_1.prisma.report.update({ where: { id }, data }),
    delete: (id) => prisma_1.prisma.report.delete({ where: { id } }),
    addTask: (data) => prisma_1.prisma.reportTask.create({ data }),
    updateTask: (id, data) => prisma_1.prisma.reportTask.update({ where: { id }, data }),
    deleteTask: (id) => prisma_1.prisma.reportTask.delete({ where: { id } }),
    createReview: (data) => prisma_1.prisma.reportReviewHistory.create({ data }),
    createVersion: (data) => prisma_1.prisma.reportVersion.create({ data }),
    addBlocker: (data) => prisma_1.prisma.reportBlocker.create({ data }),
    addAchievement: (data) => prisma_1.prisma.reportAchievement.create({ data }),
    addNextWeekTask: (data) => prisma_1.prisma.reportNextWeekTask.create({ data }),
    setOptionalFields: (reportId, data) => prisma_1.prisma.reportOptionalFields.upsert({ where: { reportId }, update: data, create: { reportId, ...data } }),
};
//# sourceMappingURL=report.repository.js.map