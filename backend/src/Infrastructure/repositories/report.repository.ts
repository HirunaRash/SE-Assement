import { prisma } from '../prisma';

const reportInclude = {
  project: true,
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  tasks: true,
  blockers: true,
  achievements: true,
  nextWeekTasks: true,
  timeByType: true,
  optionalFields: true,
  reviewHistory: { include: { reviewer: { select: { id: true, firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: 'desc' as const } },
  versions: { include: { tasks: true }, orderBy: { versionNumber: 'desc' as const } },
};

export const reportRepository = {
  findById: (id: number) => prisma.report.findUnique({ where: { id }, include: reportInclude }),
  findByUser: (userId: number) => prisma.report.findMany({ where: { userId }, include: reportInclude, orderBy: { weekStartDate: 'desc' } }),
  findAll: (filters: { status?: any; userId?: number; startDate?: Date; endDate?: Date }) => prisma.report.findMany({ where: { ...(filters.status ? { status: filters.status } : {}), ...(filters.userId ? { userId: filters.userId } : {}), ...(filters.startDate && filters.endDate ? { weekStartDate: { gte: filters.startDate, lte: filters.endDate } } : {}) }, include: reportInclude, orderBy: { weekStartDate: 'desc' } }),
  create: (data: any) => prisma.report.create({ data }),
  update: (id: number, data: any) => prisma.report.update({ where: { id }, data }),
  delete: (id: number) => prisma.report.delete({ where: { id } }),
  addTask: (data: any) => prisma.reportTask.create({ data }),
  updateTask: (id: number, data: any) => prisma.reportTask.update({ where: { id }, data }),
  deleteTask: (id: number) => prisma.reportTask.delete({ where: { id } }),
  createReview: (data: any) => prisma.reportReviewHistory.create({ data }),
  createVersion: (data: any) => prisma.reportVersion.create({ data }),
  addBlocker: (data: any) => prisma.reportBlocker.create({ data }),
  addAchievement: (data: any) => prisma.reportAchievement.create({ data }),
  addNextWeekTask: (data: any) => prisma.reportNextWeekTask.create({ data }),
  setOptionalFields: (reportId: number, data: any) => prisma.reportOptionalFields.upsert({ where: { reportId }, update: data, create: { reportId, ...data } }),
};
