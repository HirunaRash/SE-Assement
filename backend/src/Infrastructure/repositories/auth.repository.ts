import { prisma } from '../../prisma';

export const authRepository = {
  findRole: async (name: string) => prisma.roles.findUnique({ where: { name } }),

  assignRole: async (userId: number, roleId: number, assignedBy?: number) => prisma.user_roles.upsert({
    where: { userId_roleId: { userId, roleId } },
    create: { userId, roleId, assignedBy },
    update: {},
  }),

  removeRole: (userId: number, roleId: number) => prisma.user_roles.deleteMany({ where: { userId, roleId } }),

  updateLastLogin: (userId: number) => prisma.users.update({ where: { id: userId }, data: { lastLogin: new Date() } }),
};
