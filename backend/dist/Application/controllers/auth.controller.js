"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("../../Domain/services/auth.service");
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const errorStatus = (error, fallback) => {
    const statusCode = error?.statusCode;
    const prismaCode = error?.code;
    if (statusCode && statusCode >= 400 && statusCode < 600)
        return statusCode;
    if (prismaCode === 'P2002')
        return 409;
    return fallback;
};
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body || {};
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : 'team_member';
        if (!isNonEmptyString(email) || !emailPattern.test(normalizedEmail)) {
            return res.status(400).json({ error: 'A valid email is required' });
        }
        if (!isNonEmptyString(password) || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters and include an uppercase letter and number' });
        }
        if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
            return res.status(400).json({ error: 'firstName and lastName are required' });
        }
        if (!['team_member', 'manager'].includes(normalizedRole)) {
            return res.status(400).json({ error: 'role must be either team_member or manager' });
        }
        const result = await auth_service_1.authService.register(normalizedEmail, password, firstName.trim(), lastName.trim(), normalizedRole);
        return res.status(201).json({ data: { user: result.user, token: result.token } });
    }
    catch (error) {
        console.error('[auth controller] registration failed', error);
        return res.status(errorStatus(error, 500)).json({ error: error instanceof Error ? error.message : 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!isNonEmptyString(email) || !emailPattern.test(email.trim()))
            return res.status(400).json({ error: 'A valid email is required' });
        if (!isNonEmptyString(password))
            return res.status(400).json({ error: 'Password is required' });
        const result = await auth_service_1.authService.login(email.trim().toLowerCase(), password);
        return res.status(200).json({ data: { user: result.user, token: result.token } });
    }
    catch (error) {
        console.error('[auth controller] login failed', error);
        return res.status(errorStatus(error, 500)).json({ error: error instanceof Error ? error.message : 'Login failed' });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ error: 'Not authenticated' });
        return res.status(200).json({ data: await auth_service_1.authService.getUserWithRoles(req.userId) });
    }
    catch (error) {
        console.error('[auth controller] me failed', error);
        return res.status(errorStatus(error, 500)).json({ error: error instanceof Error ? error.message : 'Unable to load user' });
    }
};
exports.me = me;
const updateMe = async (req, res) => {
    try {
        if (!req.userId)
            return res.status(401).json({ error: 'Not authenticated' });
        const { email, firstName, lastName, password } = req.body || {};
        if (!isNonEmptyString(email) || !emailPattern.test(email.trim()))
            return res.status(400).json({ error: 'A valid email is required' });
        if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName))
            return res.status(400).json({ error: 'firstName and lastName are required' });
        if (password !== undefined && (!isNonEmptyString(password) || password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)))
            return res.status(400).json({ error: 'Password must be at least 8 characters and include an uppercase letter and number' });
        const user = await auth_service_1.authService.updateProfile(req.userId, { email: email.trim().toLowerCase(), firstName: firstName.trim(), lastName: lastName.trim(), password });
        return res.status(200).json({ data: user });
    }
    catch (error) {
        console.error('[auth controller] profile update failed', error);
        return res.status(errorStatus(error, 500)).json({ error: error instanceof Error ? error.message : 'Unable to update profile' });
    }
};
exports.updateMe = updateMe;
//# sourceMappingURL=auth.controller.js.map