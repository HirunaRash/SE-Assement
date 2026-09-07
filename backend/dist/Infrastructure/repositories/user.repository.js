"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const prisma_1 = require("../../prisma");
const userInclude = {
    user_roles_user_roles_userIdTousers: { include: { roles: true } },
};
const transformUser = (user, includePassword = false) => {
    if (!user)
        return null;
    const userRoles = user.user_roles_user_roles_userIdTousers || [];
    const { password, ...safeUser } = user;
    return {
        ...safeUser,
        ...(includePassword ? { password } : {}),
        roles: userRoles.map((assignment) => assignment.roles.name),
        userRoles,
    };
};
const transformUsers = (users) => users.map((user) => transformUser(user)).filter((user) => user !== null);
exports.userRepository = {
    findById: async (id) => transformUser(await prisma_1.prisma.users.findUnique({ where: { id }, include: userInclude })),
    findByEmail: async (email, includePassword = false) => transformUser(await prisma_1.prisma.users.findUnique({ where: { email }, include: userInclude }), includePassword),
    list: async (where = {}, skip = 0, take = 20) => transformUsers(await prisma_1.prisma.users.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: userInclude })),
    count: (where = {}) => prisma_1.prisma.users.count({ where }),
    create: async (data, roleId, assignedBy) => {
        const user = await prisma_1.prisma.$transaction(async (transaction) => {
            const created = await transaction.users.create({ data });
            if (roleId !== undefined) {
                await transaction.user_roles.create({ data: { userId: created.id, roleId, assignedBy } });
            }
            return transaction.users.findUnique({ where: { id: created.id }, include: userInclude });
        });
        const transformed = transformUser(user);
        if (!transformed)
            throw new Error('Created user could not be loaded');
        return transformed;
    },
    update: async (id, data) => {
        const user = await prisma_1.prisma.users.update({ where: { id }, data, include: userInclude });
        const transformed = transformUser(user);
        if (!transformed)
            throw new Error('Updated user could not be loaded');
        return transformed;
    },
    delete: (id) => prisma_1.prisma.users.delete({ where: { id } }),
    getUserWithRoles: async (userId) => transformUser(await prisma_1.prisma.users.findUnique({ where: { id: userId }, include: userInclude })),
    getUserRoles: async (userId) => {
        const user = await prisma_1.prisma.users.findUnique({ where: { id: userId }, include: userInclude });
        return transformUser(user)?.roles || [];
    },
    hasRole: async (userId, roleName) => (await exports.userRepository.getUserRoles(userId)).includes(roleName),
    role: (name) => prisma_1.prisma.roles.findUnique({ where: { name } }),
    assignRole: async (userIdOrData, roleId, assignedBy) => {
        const data = typeof userIdOrData === 'number' ? { userId: userIdOrData, roleId: roleId, assignedBy } : userIdOrData;
        return prisma_1.prisma.user_roles.upsert({ where: { userId_roleId: { userId: data.userId, roleId: data.roleId } }, create: data, update: {} });
    },
    removeRole: (userId, roleId) => prisma_1.prisma.user_roles.deleteMany({ where: { userId, roleId } }),
    removeRoles: (userId) => prisma_1.prisma.user_roles.deleteMany({ where: { userId } }),
};
//# sourceMappingURL=user.repository.js.map