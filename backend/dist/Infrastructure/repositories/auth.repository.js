"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_1 = require("../../prisma");
exports.authRepository = {
    findRole: async (name) => prisma_1.prisma.roles.findUnique({ where: { name } }),
    assignRole: async (userId, roleId, assignedBy) => prisma_1.prisma.user_roles.upsert({
        where: { userId_roleId: { userId, roleId } },
        create: { userId, roleId, assignedBy },
        update: {},
    }),
    removeRole: (userId, roleId) => prisma_1.prisma.user_roles.deleteMany({ where: { userId, roleId } }),
    updateLastLogin: (userId) => prisma_1.prisma.users.update({ where: { id: userId }, data: { lastLogin: new Date() } }),
};
//# sourceMappingURL=auth.repository.js.map