"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Extend Express Request to include user
const user_repository_1 = require("../../../Infrastructure/repositories/user.repository");
// Verify JWT token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const roles = await user_repository_1.userRepository.getRoleNames(decoded.id);
        req.user = { ...decoded, roles };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
// Check if user has specific role
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles.some((role) => roles.includes(role))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map