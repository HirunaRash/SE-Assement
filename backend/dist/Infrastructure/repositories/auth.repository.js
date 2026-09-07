"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_1 = require("../prisma");
exports.authRepository = {
    findRole: (name) => prisma_1.prisma.role.findUnique({ where: { name } }),
    assignRole: (userId, roleId, assignedBy) => prisma_1.prisma.userRole.upsert({ where: { userId_roleId: { userId, roleId } }, update: { assignedBy }, create: { userId, roleId, assignedBy } }),
    updateLastLogin: (userId) => prisma_1.prisma.user.update({ where: { id: userId }, data: { lastLogin: new Date() } }),
};
//# sourceMappingURL=auth.repository.js.map