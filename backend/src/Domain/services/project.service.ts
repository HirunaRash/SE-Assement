import { projectRepository } from '../../Infrastructure/repositories/project.repository';

export const projectService = {
  list: () => projectRepository.list(),
  getById: async (id: number) => { const project = await projectRepository.findById(id); if (!project) throw new Error('Project not found'); return project; },
  create: (data: any) => projectRepository.create(data),
  update: (id: number, data: any) => projectRepository.update(id, data),
  remove: (id: number) => projectRepository.delete(id),
  assignMember: (projectId: number, userId: number, assignedBy: number) => projectRepository.assignMember(projectId, userId, assignedBy),
  removeMember: (projectId: number, userId: number) => projectRepository.removeMember(projectId, userId),
};
