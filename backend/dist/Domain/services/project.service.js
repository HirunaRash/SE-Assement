"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const project_repository_1 = require("../../Infrastructure/repositories/project.repository");
const user_repository_1 = require("../../Infrastructure/repositories/user.repository");
exports.projectService = {
    list: () => project_repository_1.projectRepository.list(),
    get: async (id) => { const project = await project_repository_1.projectRepository.findById(id); if (!project)
        throw Object.assign(new Error('Project not found'), { statusCode: 404 }); return project; },
    create: (data, createdBy) => project_repository_1.projectRepository.create({ name: data.name, description: data.description, color: data.color, status: data.status, createdBy }),
    update: async (id, data) => { await exports.projectService.get(id); return project_repository_1.projectRepository.update(id, data); },
    remove: async (id) => { await exports.projectService.get(id); if (await project_repository_1.projectRepository.activeReportCount(id))
        throw Object.assign(new Error('Project has active reports'), { statusCode: 409 }); await project_repository_1.projectRepository.delete(id); },
    addMember: async (projectId, userId) => { await exports.projectService.get(projectId); if (!await user_repository_1.userRepository.findById(userId))
        throw Object.assign(new Error('User not found'), { statusCode: 404 }); if (await project_repository_1.projectRepository.memberExists(projectId, userId))
        throw Object.assign(new Error('User is already assigned'), { statusCode: 409 }); return project_repository_1.projectRepository.addMember(projectId, userId); },
    removeMember: async (projectId, userId) => { await exports.projectService.get(projectId); await project_repository_1.projectRepository.removeMember(projectId, userId); },
};
//# sourceMappingURL=project.service.js.map