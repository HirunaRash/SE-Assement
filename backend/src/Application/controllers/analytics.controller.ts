import { Request, Response } from 'express';
import { analyticsService } from '../../Domain/services/analytics.service';

export const analyticsController = {
  summary: async (_req: Request, res: Response) => { try { return res.json(await analyticsService.summary()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  trends: async (_req: Request, res: Response) => { try { return res.json(await analyticsService.trends()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  teamStatus: async (_req: Request, res: Response) => { try { return res.json(await analyticsService.teamStatus()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  workload: async (_req: Request, res: Response) => { try { return res.json(await analyticsService.workload()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  taskTime: async (_req: Request, res: Response) => { try { return res.json(await analyticsService.taskTime()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
  activity: async (_req: Request, res: Response) => { try { return res.json(await analyticsService.activity()); } catch (error: any) { return res.status(500).json({ error: error.message }); } },
};
