"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMember = exports.addMember = exports.remove = exports.update = exports.create = exports.get = exports.getProjects = exports.list = void 0;
const project_service_1 = require("../../Domain/services/project.service");
const list = async (req, res) => {
    const isManager = req.userRoles?.some((role) => role === 'manager' || role === 'admin') ?? false;
    const projects = isManager ? await project_service_1.projectService.list() : await project_service_1.projectService.listForMember(req.userId);
    return res.json({ data: projects.map((project) => ({
            ...project,
            teamCount: project.project_team_members?.length || 0,
        })) });
};
exports.list = list;
exports.getProjects = exports.list;
const get = async (req, res) => res.json({ data: await project_service_1.projectService.get(Number(req.params.id)) });
exports.get = get;
const create = async (req, res) => res.status(201).json({ data: await project_service_1.projectService.create(req.body, req.userId) });
exports.create = create;
const update = async (req, res) => res.json({ data: await project_service_1.projectService.update(Number(req.params.id), req.body) });
exports.update = update;
const remove = async (req, res) => { await project_service_1.projectService.remove(Number(req.params.id)); res.json({ success: true }); };
exports.remove = remove;
const addMember = async (req, res) => res.status(201).json({ data: await project_service_1.projectService.addMember(Number(req.params.id), Number(req.body.userId)) });
exports.addMember = addMember;
const removeMember = async (req, res) => { await project_service_1.projectService.removeMember(Number(req.params.id), Number(req.params.userId)); res.json({ success: true }); };
exports.removeMember = removeMember;
//# sourceMappingURL=project.controller.js.map