import bcrypt from 'bcryptjs';
import { prisma } from '../../prisma';
import { userRepository } from '../../Infrastructure/repositories/user.repository';

export const userService = {
  list: async (role: string | undefined, skip: number, take: number) => { const where = role ? { user_roles_user_roles_userIdTousers: { some: { roles: { name: role } } } } : {}; return { items: await userRepository.list(where, skip, take), total: await userRepository.count(where) }; },
  create: async (data: any, assignedBy: number) => { if (await userRepository.findByEmail(data.email)) throw Object.assign(new Error('Email already registered'), { statusCode: 409 }); const role = await userRepository.role(data.role || 'team_member'); if (!role) throw Object.assign(new Error('Invalid role'), { statusCode: 400 }); const user = await userRepository.create({ email: data.email.toLowerCase(), password: await bcrypt.hash(data.password || 'ChangeMe123', 12), firstName: data.firstName, lastName: data.lastName }); await userRepository.assignRole({ userId: user.id, roleId: role.id, assignedBy }); return userRepository.findById(user.id); },
  update: (id: number, data: any) => userRepository.update(id, { firstName: data.firstName, lastName: data.lastName }),
  remove: async (id: number) => { const active = await prisma.reports.count({ where: { userId: id, status: { not: 'approved' } } }); if (active) throw Object.assign(new Error('User has active reports'), { statusCode: 409 }); await userRepository.delete(id); },
  setRole: async (id: number, roleName: string, assignedBy: number) => { const role = await userRepository.role(roleName); if (!role) throw Object.assign(new Error('Invalid role'), { statusCode: 400 }); await userRepository.removeRoles(id); await userRepository.assignRole({ userId: id, roleId: role.id, assignedBy }); return userRepository.findById(id); },
};
