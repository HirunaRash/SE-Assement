import { prisma } from '../prisma';

export const projectRepository = {
  list: () => prisma.project.findMany({ include: { _count: { select: { reports: true, projectMembers: true } } }, orderBy: { name: 'asc' } }),
  findById: (id: number) => prisma.project.findUnique({ where: { id }, include: { _count: { select: { reports: true, projectMembers: true } } } }),
  create: (data: any) => prisma.project.create({ data }),
  update: (id: number, data: any) => prisma.project.update({ where: { id }, data }),
  delete: (id: number) => prisma.project.delete({ where: { id } }),
  assignMember: (projectId: number, userId: number, _assignedBy: number) => prisma.projectTeamMember.upsert({ where: { projectId_userId: { projectId, userId } }, update: {}, create: { projectId, userId } }),
  removeMember: (projectId: number, userId: number) => prisma.projectTeamMember.delete({ where: { projectId_userId: { projectId, userId } } }),
};
