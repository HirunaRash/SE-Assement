"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = exports.auth = exports.requireRoles = exports.authenticate = exports.roleCheckMiddleware = exports.authMiddleware = void 0;
const auth_service_1 = require("../../../Domain/services/auth.service");
const authMiddleware = (req, res, next) => {
    const header = req.header('authorization');
    const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
    if (!token)
        return res.status(401).json({ error: 'Authentication token is required' });
    try {
        const payload = auth_service_1.authService.verifyToken(token);
        req.userId = Number(payload.userId);
        req.userRoles = payload.roles;
        console.log(`[auth middleware] user ${req.userId} roles: ${req.userRoles.join(', ')}`);
        return next();
    }
    catch (error) {
        console.error('[auth middleware] token validation failed', error);
        return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }
};
exports.authMiddleware = authMiddleware;
const roleCheckMiddleware = (requiredRoles) => (req, res, next) => {
    const roles = req.userRoles || [];
    if (!roles.some((role) => requiredRoles.includes(role)))
        return res.status(403).json({ error: 'Insufficient permissions' });
    return next();
};
exports.roleCheckMiddleware = roleCheckMiddleware;
exports.authenticate = exports.authMiddleware;
const requireRoles = (...requiredRoles) => (0, exports.roleCheckMiddleware)(requiredRoles);
exports.requireRoles = requireRoles;
exports.auth = exports.authMiddleware;
exports.role = exports.requireRoles;
//# sourceMappingURL=auth.js.map