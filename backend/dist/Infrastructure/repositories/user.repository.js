"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("../prisma");
exports.userRepository = {
    findById: (id) => prisma_1.prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } } } }),
    findByEmail: (email) => prisma_1.prisma.user.findUnique({ where: { email }, include: { userRoles: { include: { role: true } } } }),
    getRoleNames: async (userId) => {
        const assignments = await prisma_1.prisma.userRole.findMany({ where: { userId }, include: { role: true } });
        return assignments.map((assignment) => assignment.role.name);
    },
    list: () => prisma_1.prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true, profilePhoto: true, bio: true, status: true, lastLogin: true, createdAt: true, updatedAt: true } }),
    create: (data) => prisma_1.prisma.user.create({ data }),
    update: (id, data) => prisma_1.prisma.user.update({ where: { id }, data }),
    delete: (id) => prisma_1.prisma.user.delete({ where: { id } }),
};
//# sourceMappingURL=user.repository.js.map