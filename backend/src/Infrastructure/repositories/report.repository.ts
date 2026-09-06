import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportRepository {

  async addTask(reportId: number, data: any) {
  return prisma.reportTask.create({
    data: {
      reportId,
      taskName: data.taskName,
      priority: data.priority,
      plannedPercentage: data.plannedPercentage ?? 0,
      actualPercentage: data.actualPercentage ?? 0,
      status: data.status ?? 'Not Started',
      timePlannedHours: data.timePlannedHours ?? 0,
      timeSpentHours: data.timeSpentHours ?? 0,
      deliverable: data.deliverable
    }
  });
}

async updateTask(taskId: number, data: any) {
  return prisma.reportTask.update({
    where: { id: taskId },
    data
  });
}

async deleteTask(taskId: number) {
  return prisma.reportTask.delete({ where: { id: taskId } });
}

async findTaskById(taskId: number) {
  return prisma.reportTask.findUnique({ where: { id: taskId } });
} 
    
  async create(data: any) {
    return prisma.report.create({ data });
  }

  async findById(id: number) {
    return prisma.report.findUnique({
      where: { id },
      include: { tasks: true, reviews: true, project: true, user: true }
    });
  }

  async findByUserIdAndId(userId: number, reportId: number) {
    return prisma.report.findFirst({
      where: { id: reportId, userId },
      include: { tasks: true, reviews: true, project: true }
    });
  }

  async findByUserId(userId: number) {
    return prisma.report.findMany({
      where: { userId },
      include: { tasks: true, reviews: true, project: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAll(filters: any) {
    return prisma.report.findMany({
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.userId && { userId: filters.userId })
      },
      include: { user: true, tasks: true, reviews: true, project: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async update(id: number, data: any) {
    return prisma.report.update({
      where: { id },
      data
    });
  }

  async addReview(reportId: number, managerId: number, comment: string, action: string) {
    return prisma.reviewComment.create({
      data: { reportId, managerId, comment, action }
    });
  }

  async getReviews(reportId: number) {
    return prisma.reviewComment.findMany({
      where: { reportId },
      include: { manager: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}