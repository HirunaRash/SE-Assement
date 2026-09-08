import { Request, Response } from 'express';
import { analyticsService } from '../../Domain/services/analytics.service';
import { numberParam, optionalDate } from '../../Api/utils/params';

export const summary = async (req: Request, res: Response) => res.json({ data: await analyticsService.summary(optionalDate(req.query.weekStart)) });
export const submissionByUser = async (req: Request, res: Response) => res.json({ data: await analyticsService.submissionByUser(optionalDate(req.query.weekStart)) });
export const tasksTrend = async (req: Request, res: Response) => res.json({ data: await analyticsService.tasksTrend(optionalDate(req.query.startDate), optionalDate(req.query.endDate)) });
export const workload = async (_req: Request, res: Response) => res.json({ data: await analyticsService.workload() });
export const timeByType = async (_req: Request, res: Response) => res.json({ data: await analyticsService.timeByType() });
export const recentActivity = async (req: Request, res: Response) => res.json({ data: await analyticsService.recentActivity(numberParam(req.query.limit, 10, 1, 100)) });
export const blockers = async (_req: Request, res: Response) => res.json({ data: await analyticsService.blockers() });

// Compatibility endpoints used by the existing manager dashboard.
export const trends = async (req: Request, res: Response) => res.json({ data: await analyticsService.tasksTrend(optionalDate(req.query.startDate), optionalDate(req.query.endDate)) });
export const teamStatus = async (req: Request, res: Response) => res.json({ data: await analyticsService.submissionByUser(optionalDate(req.query.weekStart)) });
export const activity = async (req: Request, res: Response) => res.json({ data: await analyticsService.recentActivity(numberParam(req.query.limit, 10, 1, 100)) });
export const teamSection = async (req: Request, res: Response) => {
	const section = req.query.section === 'achievements' ? 'achievements' : 'blockers';
	const weekStart = optionalDate(req.query.weekStart);
	if (!weekStart) return res.status(400).json({ error: 'A valid weekStart date is required' });
	return res.json({ data: await analyticsService.teamSection(weekStart, section) });
};
