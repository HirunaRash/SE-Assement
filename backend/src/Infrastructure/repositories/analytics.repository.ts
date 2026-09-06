import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsRepository {
  private getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

  async getReportCounts() {
  const { start, end } = this.getCurrentWeekRange();

  return {
    totalReports: await prisma.report.count(),
    submittedReports: await prisma.report.count({ where: { status: 'Submitted' } }),
    approvedReports: await prisma.report.count({ where: { status: 'Approved' } }),
    needsCorrection: await prisma.report.count({ where: { status: 'Needs Correction' } }),
    submittedThisWeek: await prisma.report.count({
      where: { weekStartDate: { gte: start, lte: end } }
    })
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

async getOpenBlockersCount() {
  return prisma.report.count({
    where: {
      blockers: { not: null },
      NOT: { blockers: '' },
      status: { in: ['Submitted', 'Needs Correction'] }
    }
  });
}

async getTeamStatusForWeek(weekStartDate: string) {
  const target = new Date(weekStartDate);

  const members = await prisma.user.findMany({
    where: { role: 'team_member' },
    select: { id: true, fullName: true, email: true }
  });

  const reports = await prisma.report.findMany({
    where: { weekStartDate: target },
    select: { userId: true, status: true }
  });

  const reportMap = new Map(reports.map(r => [r.userId, r.status]));

  return members.map(member => ({
    userId: member.id,
    name: member.fullName,
    email: member.email,
    status: reportMap.get(member.id) || 'Not Started'
  }));
}

async getRecentActivity() {
  const recentReviews = await prisma.reviewComment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      manager: { select: { fullName: true } },
      report: { select: { id: true, weekStartDate: true, user: { select: { fullName: true } } } }
    }
  });

  return recentReviews.map(r => ({
    type: r.action,
    reportId: r.report.id,
    teamMember: r.report.user.fullName,
    manager: r.manager.fullName,
    comment: r.comment,
    weekStartDate: r.report.weekStartDate,
    timestamp: r.createdAt
  }));
}
}