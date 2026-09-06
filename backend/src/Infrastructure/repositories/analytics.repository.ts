import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsRepository {
  async getReportCounts() {
    return {
      totalReports: await prisma.report.count(),
      submittedReports: await prisma.report.count({ where: { status: 'Submitted' } }),
      approvedReports: await prisma.report.count({ where: { status: 'Approved' } }),
      needsCorrection: await prisma.report.count({ where: { status: 'Needs Correction' } })
    };
  }

  async getReportsTrend() {
    return prisma.report.findMany({
      select: { weekStartDate: true, status: true },
      orderBy: { weekStartDate: 'asc' }
    });
  }

  async getTeamMembers() {
    return prisma.user.findMany({
      where: { role: 'team_member' },
      select: { id: true, fullName: true, email: true }
    });
  }

  async getUserReportStats(userId: number) {
    return {
      totalReports: await prisma.report.count({ where: { userId } }),
      approvedReports: await prisma.report.count({ where: { userId, status: 'Approved' } }),
      pendingReports: await prisma.report.count({ where: { userId, status: 'Submitted' } })
    };
  }

  async getProjectWorkload() {
    return prisma.report.findMany({
      select: { project: { select: { name: true } } }
    });
  }
}