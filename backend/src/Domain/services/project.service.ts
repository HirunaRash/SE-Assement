import { projectRepository } from '../../Infrastructure/repositories/project.repository';
import { userRepository } from '../../Infrastructure/repositories/user.repository';

export const projectService = {
  list: () => projectRepository.list(),
  get: async (id: number) => { const project = await projectRepository.findById(id); if (!project) throw Object.assign(new Error('Project not found'), { statusCode: 404 }); return project; },
  create: (data: any, createdBy: number) => projectRepository.create({ name: data.name, description: data.description, color: data.color, status: data.status, createdBy }),
  update: async (id: number, data: any) => { await projectService.get(id); return projectRepository.update(id, data); },
  remove: async (id: number) => { await projectService.get(id); if (await projectRepository.activeReportCount(id)) throw Object.assign(new Error('Project has active reports'), { statusCode: 409 }); await projectRepository.delete(id); },
  addMember: async (projectId: number, userId: number) => { await projectService.get(projectId); if (!await userRepository.findById(userId)) throw Object.assign(new Error('User not found'), { statusCode: 404 }); if (await projectRepository.memberExists(projectId, userId)) throw Object.assign(new Error('User is already assigned'), { statusCode: 409 }); return projectRepository.addMember(projectId, userId); },
  removeMember: async (projectId: number, userId: number) => { await projectService.get(projectId); await projectRepository.removeMember(projectId, userId); },
};
