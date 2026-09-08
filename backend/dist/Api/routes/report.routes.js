"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("./../../Application/controllers/report.controller"));
const auth_1 = require("./../middleware/auth/auth");
const validation_1 = require("./../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/my-reports', (0, auth_1.requireRoles)('team_member', 'manager', 'admin'), controller.myList);
router.get('/my-reports/:id', (0, auth_1.requireRoles)('team_member', 'manager', 'admin'), controller.getMine);
router.get('/manager/all', (0, auth_1.requireRoles)('manager', 'admin'), controller.getTeamReports);
router.post('/', (0, auth_1.requireRoles)('team_member'), (0, validation_1.bodyRequired)('weekStartDate', 'weekEndDate'), controller.create);
router.put('/:id', (0, auth_1.requireRoles)('team_member'), controller.update);
router.patch('/:id', (0, auth_1.requireRoles)('team_member'), controller.update);
router.put('/:id/submit', (0, auth_1.requireRoles)('team_member'), controller.submit);
router.post('/:id/tasks', (0, auth_1.requireRoles)('team_member'), (0, validation_1.bodyRequired)('taskName'), controller.task);
router.put('/:id/tasks/:taskId', (0, auth_1.requireRoles)('team_member'), controller.updateTask);
router.delete('/:id/tasks/:taskId', (0, auth_1.requireRoles)('team_member'), controller.deleteTask);
for (const resource of ['blockers', 'achievements', 'next-week-tasks']) {
    router.post(`/:id/${resource}`, (0, auth_1.requireRoles)('team_member'), controller.child);
    router.put(`/:id/${resource}/:taskId`, (0, auth_1.requireRoles)('team_member'), controller.updateChild);
    router.delete(`/:id/${resource}/:taskId`, (0, auth_1.requireRoles)('team_member'), controller.deleteChild);
}
router.post('/:id/time-by-type', (0, auth_1.requireRoles)('team_member'), controller.time);
router.get('/', (0, auth_1.requireRoles)('manager', 'admin'), controller.all);
router.get('/:id/versions/:versionNumber', (0, auth_1.requireRoles)('team_member', 'manager', 'admin'), controller.version);
router.get('/:id/versions', (0, auth_1.requireRoles)('team_member', 'manager', 'admin'), controller.versions);
router.get('/:id/review-history', (0, auth_1.requireRoles)('manager', 'admin'), controller.history);
router.put('/:id/approve', (0, auth_1.requireRoles)('manager', 'admin'), controller.approve);
router.put('/:id/request-changes', (0, auth_1.requireRoles)('manager', 'admin'), (0, validation_1.bodyRequired)('comment'), controller.requestChanges);
router.get('/:id', (0, auth_1.requireRoles)('team_member', 'manager', 'admin'), controller.getAccessible);
exports.default = router;
//# sourceMappingURL=report.routes.js.map