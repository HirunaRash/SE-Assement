import { Request, Response } from 'express';
import { ReportService } from '../../Domain/services/report.service';
import { parseIdParam } from '../../Api/utils/params';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  async addTask(req: Request, res: Response) {
  try {
    const task = await this.reportService.addTask(
      parseIdParam(req.params.id), req.user!.id, req.body
    );
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async updateTask(req: Request, res: Response) {
  try {
    const task = await this.reportService.updateTask(
      parseIdParam(req.params.taskId), req.user!.id, req.body
    );
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async deleteTask(req: Request, res: Response) {
  try {
    await this.reportService.deleteTask(parseIdParam(req.params.taskId), req.user!.id);
    res.json({ message: 'Task deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

  async createReport(req: Request, res: Response) {
    try {
      const report = await this.reportService.createReport(req.user!.id, req.body);
      res.status(201).json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReport(req: Request, res: Response) {
    try {
      const report = await this.reportService.getReport(
        parseIdParam(req.params.id),
        req.user!.id,
        req.user!.role
      );
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }


  async getUserReports(req: Request, res: Response) {
    try {
      const reports = await this.reportService.getUserReports(req.user!.id);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReport(req: Request, res: Response) {
    try {
      const report = await this.reportService.updateReport(
        parseIdParam(req.params.id),
        req.user!.id,
        req.body
      );
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async submitReport(req: Request, res: Response) {
    try {
      const report = await this.reportService.submitReport(
        parseIdParam(req.params.id),
        req.user!.id
      );
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });

    }
  }

  async getAllReports(req: Request, res: Response) {
  try {
    const { status, projectId, userId, startDate, endDate } = req.query;
    const reports = await this.reportService.getAllReports({
      status: status as string,
      projectId: projectId ? parseInt(projectId as string) : undefined,
      userId: userId ? parseInt(userId as string) : undefined,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

  async reviewReport(req: Request, res: Response) {
    try {
      const { action, comment } = req.body;
      const report = await this.reportService.reviewReport(
        parseIdParam(req.params.id),
        req.user!.id,
        action,
        comment
      );
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}