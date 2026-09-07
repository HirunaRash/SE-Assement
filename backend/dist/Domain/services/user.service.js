"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../../prisma");
const user_repository_1 = require("../../Infrastructure/repositories/user.repository");
exports.userService = {
    list: async (role, skip, take) => { const where = role ? { user_roles_user_roles_userIdTousers: { some: { roles: { name: role } } } } : {}; return { items: await user_repository_1.userRepository.list(where, skip, take), total: await user_repository_1.userRepository.count(where) }; },
    create: async (data, assignedBy) => { if (await user_repository_1.userRepository.findByEmail(data.email))
        throw Object.assign(new Error('Email already registered'), { statusCode: 409 }); const role = await user_repository_1.userRepository.role(data.role || 'team_member'); if (!role)
        throw Object.assign(new Error('Invalid role'), { statusCode: 400 }); const user = await user_repository_1.userRepository.create({ email: data.email.toLowerCase(), password: await bcryptjs_1.default.hash(data.password || 'ChangeMe123', 12), firstName: data.firstName, lastName: data.lastName }); await user_repository_1.userRepository.assignRole({ userId: user.id, roleId: role.id, assignedBy }); return user_repository_1.userRepository.findById(user.id); },
    update: (id, data) => user_repository_1.userRepository.update(id, { firstName: data.firstName, lastName: data.lastName }),
    remove: async (id) => { const active = await prisma_1.prisma.reports.count({ where: { userId: id, status: { not: 'approved' } } }); if (active)
        throw Object.assign(new Error('User has active reports'), { statusCode: 409 }); await user_repository_1.userRepository.delete(id); },
    setRole: async (id, roleName, assignedBy) => { const role = await user_repository_1.userRepository.role(roleName); if (!role)
        throw Object.assign(new Error('Invalid role'), { statusCode: 400 }); await user_repository_1.userRepository.removeRoles(id); await user_repository_1.userRepository.assignRole({ userId: id, roleId: role.id, assignedBy }); return user_repository_1.userRepository.findById(id); },
};
//# sourceMappingURL=user.service.js.map