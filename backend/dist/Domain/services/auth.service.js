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
const publicUser = (user, roles) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePhoto: user.profilePhoto,
    bio: user.bio,
    status: user.status,
    roles,
    createdAt: user.createdAt,
});
const tokenFor = (user) => jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
exports.authService = {
    register: async (data) => {
        if (await user_repository_1.userRepository.findByEmail(data.email))
            throw new Error('Email already registered');
        const user = await user_repository_1.userRepository.create({ ...data, password: await bcryptjs_1.default.hash(data.password, 10) });
        const roleName = data.role === 'manager' ? 'manager' : 'team_member';
        const role = await auth_repository_1.authRepository.findRole(roleName);
        if (!role)
            throw new Error(`Role '${roleName}' is not configured`);
        await auth_repository_1.authRepository.assignRole(user.id, role.id);
        return { token: tokenFor(user), user: publicUser(user, [roleName]) };
    },
    login: async (email, password) => {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user || !(await bcryptjs_1.default.compare(password, user.password)))
            throw new Error('Invalid email or password');
        const roles = user.userRoles.map((assignment) => assignment.role.name);
        await auth_repository_1.authRepository.updateLastLogin(user.id);
        return { token: tokenFor(user), user: publicUser(user, roles) };
    },
    me: async (userId) => {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user)
            throw new Error('User not found');
        return publicUser(user, user.userRoles.map((assignment) => assignment.role.name));
    },
};
//# sourceMappingURL=auth.service.js.map