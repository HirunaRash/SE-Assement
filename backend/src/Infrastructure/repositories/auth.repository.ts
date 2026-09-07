import { prisma } from '../prisma';

export const authRepository = {
  findRole: (name: string) => prisma.role.findUnique({ where: { name } }),
  assignRole: (userId: number, roleId: number, assignedBy?: number) => prisma.userRole.upsert({ where: { userId_roleId: { userId, roleId } }, update: { assignedBy }, create: { userId, roleId, assignedBy } }),
  updateLastLogin: (userId: number) => prisma.user.update({ where: { id: userId }, data: { lastLogin: new Date() } }),
};
