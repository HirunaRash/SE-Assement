import { Request, Response } from 'express';
import { projectService } from '../../Domain/services/project.service';

export const list = async (_req: Request, res: Response) => {
	const projects: any[] = await projectService.list();
	return res.json({ data: projects.map((project) => ({
		...project,
		teamCount: project.project_team_members?.length || 0,
	})) });
};
export const getProjects = list;
export const get = async (req: Request, res: Response) => res.json({ data: await projectService.get(Number(req.params.id)) });
export const create = async (req: Request, res: Response) => res.status(201).json({ data: await projectService.create(req.body, req.userId!) });
export const update = async (req: Request, res: Response) => res.json({ data: await projectService.update(Number(req.params.id), req.body) });
export const remove = async (req: Request, res: Response) => { await projectService.remove(Number(req.params.id)); res.json({ success: true }); };
export const addMember = async (req: Request, res: Response) => res.status(201).json({ data: await projectService.addMember(Number(req.params.id), Number(req.body.userId)) });
export const removeMember = async (req: Request, res: Response) => { await projectService.removeMember(Number(req.params.id), Number(req.params.userId)); res.json({ success: true }); };
