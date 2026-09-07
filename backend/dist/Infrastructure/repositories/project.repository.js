"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepository = void 0;
const prisma_1 = require("../../prisma");
const include = { project_team_members: { include: { users: { select: { id: true, email: true, firstName: true, lastName: true } } } } };
exports.projectRepository = {
    list: () => prisma_1.prisma.projects.findMany({ include, orderBy: { createdAt: 'desc' } }),
    findById: (id) => prisma_1.prisma.projects.findUnique({ where: { id }, include }),
    create: (data) => prisma_1.prisma.projects.create({ data, include }),
    update: (id, data) => prisma_1.prisma.projects.update({ where: { id }, data, include }),
    delete: (id) => prisma_1.prisma.projects.delete({ where: { id } }),
    addMember: (projectId, userId) => prisma_1.prisma.project_team_members.create({ data: { projectId, userId } }),
    removeMember: (projectId, userId) => prisma_1.prisma.project_team_members.deleteMany({ where: { projectId, userId } }),
    memberExists: (projectId, userId) => prisma_1.prisma.project_team_members.findUnique({ where: { projectId_userId: { projectId, userId } } }),
    activeReportCount: (projectId) => prisma_1.prisma.reports.count({ where: { projectId, status: { not: 'approved' } } }),
};
//# sourceMappingURL=project.repository.js.map