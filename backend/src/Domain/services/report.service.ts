import { ReportRepository } from '../../Infrastructure/repositories/report.repository';

export class ReportService {
  private reportRepository: ReportRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async addTask(reportId: number, userId: number, data: any) {
  const report = await this.reportRepository.findByUserIdAndId(userId, reportId);
  if (!report) throw new Error('Report not found');
  if (report.status !== 'Draft' && report.status !== 'Needs Correction') {
    throw new Error('Can only add tasks to draft or correction reports');
  }
  return this.reportRepository.addTask(reportId, data);
}

async updateTask(taskId: number, userId: number, data: any) {
  const task = await this.reportRepository.findTaskById(taskId);
  if (!task) throw new Error('Task not found');
  const report = await this.reportRepository.findByUserIdAndId(userId, task.reportId);
  if (!report) throw new Error('Access denied');
  return this.reportRepository.updateTask(taskId, data);
}

async deleteTask(taskId: number, userId: number) {
  const task = await this.reportRepository.findTaskById(taskId);
  if (!task) throw new Error('Task not found');
  const report = await this.reportRepository.findByUserIdAndId(userId, task.reportId);
  if (!report) throw new Error('Access denied');
  return this.reportRepository.deleteTask(taskId);
}

  async createReport(userId: number, data: any) {
    return this.reportRepository.create({
      userId,
      weekStartDate: new Date(data.weekStartDate),
      projectId: data.projectId,
      achievements: data.achievements || '',
      blockers: data.blockers || '',
      plannedNextWeek: data.plannedNextWeek || '',
      status: 'Draft'
    });
  }

  async getReport(reportId: number, userId: number, role: string) {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    // Team member can only see own reports
    if (role === 'team_member' && report.userId !== userId) {
      throw new Error('Access denied');
    }

    return report;
  }

  async getUserReports(userId: number) {
    return this.reportRepository.findByUserId(userId);
  }

  async updateReport(reportId: number, userId: number, data: any) {
    const report = await this.reportRepository.findByUserIdAndId(userId, reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'Draft' && report.status !== 'Needs Correction') {
      throw new Error('Can only edit draft or correction reports');
    }

    return this.reportRepository.update(reportId, data);
  }

  async submitReport(reportId: number, userId: number) {
    const report = await this.reportRepository.findByUserIdAndId(userId, reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'Draft' && report.status !== 'Needs Correction') {
      throw new Error('Can only submit draft reports');
    }

    return this.reportRepository.update(reportId, { status: 'Submitted' });
  }

  async getAllReports(filters: any) {
    return this.reportRepository.findAll(filters);
  }

  async reviewReport(reportId: number, managerId: number, action: string, comment: string) {
    const report = await this.reportRepository.findById(reportId);

    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== 'Submitted') {
      throw new Error('Can only review submitted reports');
    }

    // Add review comment
    await this.reportRepository.addReview(reportId, managerId, comment, action);

    // Update status
    const newStatus = action === 'Approved' ? 'Approved' : 'Needs Correction';
    return this.reportRepository.update(reportId, { status: newStatus });
  }
}