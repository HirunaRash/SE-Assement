"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRepository = void 0;
const prisma_1 = require("../prisma");
exports.projectRepository = {
    list: () => prisma_1.prisma.project.findMany({ include: { _count: { select: { reports: true, projectMembers: true } } }, orderBy: { name: 'asc' } }),
    findById: (id) => prisma_1.prisma.project.findUnique({ where: { id }, include: { _count: { select: { reports: true, projectMembers: true } } } }),
    create: (data) => prisma_1.prisma.project.create({ data }),
    update: (id, data) => prisma_1.prisma.project.update({ where: { id }, data }),
    delete: (id) => prisma_1.prisma.project.delete({ where: { id } }),
    assignMember: (projectId, userId, _assignedBy) => prisma_1.prisma.projectTeamMember.upsert({ where: { projectId_userId: { projectId, userId } }, update: {}, create: { projectId, userId } }),
    removeMember: (projectId, userId) => prisma_1.prisma.projectTeamMember.delete({ where: { projectId_userId: { projectId, userId } } }),
};
//# sourceMappingURL=project.repository.js.map