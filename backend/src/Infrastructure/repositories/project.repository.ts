import { prisma } from '../../prisma';

const include = { project_team_members: { include: { users: { select: { id: true, email: true, firstName: true, lastName: true } } } } } as const;

export const projectRepository = {
  list: () => prisma.projects.findMany({ include, orderBy: { createdAt: 'desc' } }),
  listForMember: (userId: number) => prisma.projects.findMany({ where: { project_team_members: { some: { userId } } }, include, orderBy: { createdAt: 'desc' } }),
  findById: (id: number) => prisma.projects.findUnique({ where: { id }, include }),
  create: (data: any) => prisma.projects.create({ data, include }),
  update: (id: number, data: any) => prisma.projects.update({ where: { id }, data, include }),
  delete: (id: number) => prisma.projects.delete({ where: { id } }),
  addMember: (projectId: number, userId: number) => prisma.project_team_members.create({ data: { projectId, userId } }),
  removeMember: (projectId: number, userId: number) => prisma.project_team_members.deleteMany({ where: { projectId, userId } }),
  memberExists: (projectId: number, userId: number) => prisma.project_team_members.findUnique({ where: { projectId_userId: { projectId, userId } } }),
  activeReportCount: (projectId: number) => prisma.reports.count({ where: { projectId, status: { not: 'approved' } } }),
};
