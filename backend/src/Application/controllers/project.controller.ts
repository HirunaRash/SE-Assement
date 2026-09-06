import { Request, Response } from 'express';
import { ProjectService } from '../../Domain/services/project.service';
import { parseIdParam } from '../../Api/utils/params';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await this.projectService.getAllProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProject(req: Request, res: Response) {
    try {
      const project = await this.projectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProject(req: Request, res: Response) {
    try {
      const project = await this.projectService.updateProject(
      parseIdParam(req.params.id),   // was: parseInt(req.params.id)
      req.body
    );
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProject(req: Request, res: Response) {
    try {
      await this.projectService.deleteProject(parseIdParam(req.params.id));
      res.json({ message: 'Project deleted' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}