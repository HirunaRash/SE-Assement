"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const project_repository_1 = require("../../Infrastructure/repositories/project.repository");
exports.projectService = {
    list: () => project_repository_1.projectRepository.list(),
    getById: async (id) => { const project = await project_repository_1.projectRepository.findById(id); if (!project)
        throw new Error('Project not found'); return project; },
    create: (data) => project_repository_1.projectRepository.create(data),
    update: (id, data) => project_repository_1.projectRepository.update(id, data),
    remove: (id) => project_repository_1.projectRepository.delete(id),
    assignMember: (projectId, userId, assignedBy) => project_repository_1.projectRepository.assignMember(projectId, userId, assignedBy),
    removeMember: (projectId, userId) => project_repository_1.projectRepository.removeMember(projectId, userId),
};
//# sourceMappingURL=project.service.js.map