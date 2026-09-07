import { prisma } from '../prisma';

export const userRepository = {
  findById: (id: number) => prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } } } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email }, include: { userRoles: { include: { role: true } } } }),
  getRoleNames: async (userId: number) => {
    const assignments = await prisma.userRole.findMany({ where: { userId }, include: { role: true } });
    return assignments.map((assignment) => assignment.role.name);
  },
  list: () => prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true, profilePhoto: true, bio: true, status: true, lastLogin: true, createdAt: true, updatedAt: true } }),
  create: (data: { email: string; password: string; firstName: string; lastName: string; profilePhoto?: string; bio?: string }) => prisma.user.create({ data }),
  update: (id: number, data: Record<string, unknown>) => prisma.user.update({ where: { id }, data }),
  delete: (id: number) => prisma.user.delete({ where: { id } }),
};
