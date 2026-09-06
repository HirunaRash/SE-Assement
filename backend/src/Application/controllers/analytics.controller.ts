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

  async getRecentActivity(req: Request, res: Response) {
  try {
    const activity = await this.analyticsService.getRecentActivity();
    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  }
  
  async getTeamStatusForWeek(req: Request, res: Response) {
  try {
    const { week } = req.query;
    if (!week) return res.status(400).json({ error: 'week query param required' });
    const status = await this.analyticsService.getTeamStatusForWeek(week as string);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
  
}