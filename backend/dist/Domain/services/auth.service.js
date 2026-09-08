"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("../../Infrastructure/repositories/auth.repository");
const user_repository_1 = require("../../Infrastructure/repositories/user.repository");
const jwtSecret = () => process.env.JWT_SECRET || 'development-secret-change-me';
const authError = (message, statusCode) => Object.assign(new Error(message), { statusCode });
const toPublicUser = (user) => ({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles: user.roles });
const createToken = (user, roles) => jsonwebtoken_1.default.sign({ userId: user.id, roles }, jwtSecret(), { expiresIn: '7d' });
exports.authService = {
    register: async (email, password, firstName, lastName, requestedRole = 'team_member') => {
        try {
            const roleName = requestedRole.trim().toLowerCase();
            if (!['team_member', 'manager'].includes(roleName))
                throw authError('Invalid role. Use team_member or manager', 400);
            const existingUser = await user_repository_1.userRepository.findByEmail(email);
            if (existingUser)
                throw authError('Email already registered', 409);
            const role = await auth_repository_1.authRepository.findRole(roleName);
            if (!role)
                throw authError(`Role '${roleName}' is not configured in the database`, 500);
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            // userRepository.create performs one transaction: users row plus user_roles row.
            const createdUser = await user_repository_1.userRepository.create({ email, password: hashedPassword, firstName, lastName }, role.id);
            const userWithRoles = await user_repository_1.userRepository.getUserWithRoles(createdUser.id);
            if (!userWithRoles)
                throw authError('Registered user could not be loaded', 500);
            const roles = await user_repository_1.userRepository.getUserRoles(createdUser.id);
            if (!roles.length)
                throw authError('Role assignment failed', 500);
            console.log(`[auth] registered ${createdUser.email} with roles: ${roles.join(', ')}`);
            return { user: toPublicUser(userWithRoles), token: createToken(userWithRoles, roles) };
        }
        catch (error) {
            console.error('[auth service] registration failed', error);
            if (error.code === 'P2002')
                throw authError('Email already registered', 409);
            throw error;
        }
    },
    login: async (email, password) => {
        try {
            const user = await user_repository_1.userRepository.findByEmail(email, true);
            if (!user?.password || !(await bcryptjs_1.default.compare(password, user.password)))
                throw authError('Invalid email or password', 401);
            const userWithRoles = await user_repository_1.userRepository.getUserWithRoles(user.id);
            if (!userWithRoles)
                throw authError('User not found', 404);
            const roles = await user_repository_1.userRepository.getUserRoles(user.id);
            if (!roles.length)
                throw authError('User has no assigned roles', 403);
            await auth_repository_1.authRepository.updateLastLogin(user.id);
            return { user: toPublicUser(userWithRoles), token: createToken(userWithRoles, roles) };
        }
        catch (error) {
            console.error('[auth service] login failed', error);
            throw error;
        }
    },
    getUserWithRoles: async (userId) => {
        const user = await user_repository_1.userRepository.getUserWithRoles(userId);
        if (!user)
            throw authError('User not found', 404);
        return toPublicUser(user);
    },
    me: async (userId) => exports.authService.getUserWithRoles(userId),
    updateProfile: async (userId, data) => {
        const existing = await user_repository_1.userRepository.findByEmail(data.email);
        if (existing && existing.id !== userId)
            throw authError('Email already registered', 409);
        const updateData = { email: data.email, firstName: data.firstName, lastName: data.lastName };
        if (data.password)
            updateData.password = await bcryptjs_1.default.hash(data.password, 10);
        const updated = await user_repository_1.userRepository.update(userId, updateData);
        return toPublicUser(updated);
    },
    updateLastLogin: (userId) => auth_repository_1.authRepository.updateLastLogin(userId),
    verifyToken: (token) => {
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret());
        if (!payload.userId || !Array.isArray(payload.roles) || payload.roles.some((role) => typeof role !== 'string'))
            throw authError('Invalid authentication token', 401);
        return payload;
    },
    assignRole: async (userId, roleName, assignedBy) => {
        const role = await auth_repository_1.authRepository.findRole(roleName);
        if (!role)
            throw authError(`Role '${roleName}' not found`, 404);
        await auth_repository_1.authRepository.assignRole(userId, role.id, assignedBy);
        return user_repository_1.userRepository.getUserWithRoles(userId);
    },
    removeRole: async (userId, roleName) => {
        const role = await auth_repository_1.authRepository.findRole(roleName);
        if (!role)
            throw authError(`Role '${roleName}' not found`, 404);
        await auth_repository_1.authRepository.removeRole(userId, role.id);
        return user_repository_1.userRepository.getUserWithRoles(userId);
    },
    hasRole: (userId, roleName) => user_repository_1.userRepository.hasRole(userId, roleName),
};
//# sourceMappingURL=auth.service.js.map