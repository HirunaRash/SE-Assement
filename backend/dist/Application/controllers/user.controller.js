"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRole = exports.remove = exports.update = exports.create = exports.list = void 0;
const user_service_1 = require("../../Domain/services/user.service");
const params_1 = require("../../Api/utils/params");
const list = async (req, res) => res.json({ data: await user_service_1.userService.list(typeof req.query.role === 'string' ? req.query.role : undefined, (0, params_1.numberParam)(req.query.skip, 0), (0, params_1.numberParam)(req.query.take, 20, 1, 100)) });
exports.list = list;
const create = async (req, res) => res.status(201).json({ data: await user_service_1.userService.create(req.body, req.userId) });
exports.create = create;
const update = async (req, res) => res.json({ data: await user_service_1.userService.update(Number(req.params.id), req.body) });
exports.update = update;
const remove = async (req, res) => { await user_service_1.userService.remove(Number(req.params.id)); res.json({ success: true }); };
exports.remove = remove;
const setRole = async (req, res) => res.json({ data: await user_service_1.userService.setRole(Number(req.params.id), req.body.role, req.userId) });
exports.setRole = setRole;
//# sourceMappingURL=user.controller.js.map