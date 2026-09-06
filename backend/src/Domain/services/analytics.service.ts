import { AnalyticsRepository } from '../../Infrastructure/repositories/analytics.repository';

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.analyticsRepository = new AnalyticsRepository();
  }

  async getSummary() {
  const counts = await this.analyticsRepository.getReportCounts();
  const openBlockers = await this.analyticsRepository.getOpenBlockersCount();
  const total = counts.totalReports;

  return {
    ...counts,
    openBlockers,
    complianceRate: total > 0 ? Math.round((counts.approvedReports / total) * 100) : 0
  };
}

  async getTrends() {
    const reports = await this.analyticsRepository.getReportsTrend();

    const trends = reports.reduce((acc: any, report) => {
      const week = new Date(report.weekStartDate).toISOString().split('T')[0];
      if (!acc[week]) {
        acc[week] = { week, count: 0, completed: 0 };
      }
      acc[week].count++;
      if (report.status === 'Approved') acc[week].completed++;
      return acc;
    }, {});

    return Object.values(trends);
  }

  async getTeamStatus() {
    const users = await this.analyticsRepository.getTeamMembers();

    return Promise.all(
      users.map(async (user) => ({
        userId: user.id,
        name: user.fullName,
        email: user.email,
        ...(await this.analyticsRepository.getUserReportStats(user.id))
      }))
    );
  }

  async getWorkload() {
    const reports = await this.analyticsRepository.getProjectWorkload();

    const workload = reports.reduce((acc: any, report: any) => {
      const projectName = report.project?.name || 'Unassigned';
      if (!acc[projectName]) {
        acc[projectName] = 0;
      }
      acc[projectName]++;
      return acc;
    }, {});

    return Object.entries(workload).map(([name, count]) => ({
      name,
      value: count
    }));
  }

  async getTeamStatusForWeek(weekStartDate: string) {
  return this.analyticsRepository.getTeamStatusForWeek(weekStartDate);
  }

  async getRecentActivity() {
  return this.analyticsRepository.getRecentActivity();
  }
}