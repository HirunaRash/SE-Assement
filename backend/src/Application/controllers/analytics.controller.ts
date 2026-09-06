import { Request, Response } from 'express';
import { AnalyticsService } from '../../Domain/services/analytics.service';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await this.analyticsService.getSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTrends(req: Request, res: Response) {
    try {
      const trends = await this.analyticsService.getTrends();
      res.json(trends);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTeamStatus(req: Request, res: Response) {
    try {
      const teamStatus = await this.analyticsService.getTeamStatus();
      res.json(teamStatus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWorkload(req: Request, res: Response) {
    try {
      const workload = await this.analyticsService.getWorkload();
      res.json(workload);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}