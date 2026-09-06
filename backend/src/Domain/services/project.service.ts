import { ProjectRepository } from '../../Infrastructure/repositories/project.repository';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async getAllProjects() {
    return this.projectRepository.findAll();
  }

  async createProject(data: { name: string; description?: string }) {
    return this.projectRepository.create(data);
  }

  async updateProject(projectId: number, data: any) {
    return this.projectRepository.update(projectId, data);
  }

  async deleteProject(projectId: number) {
    return this.projectRepository.delete(projectId);
  }
}