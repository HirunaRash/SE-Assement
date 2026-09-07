"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authFields = exports.parseId = exports.bodyRequired = exports.validatePassword = exports.validateEmail = void 0;
const validateEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
exports.validateEmail = validateEmail;
const validatePassword = (password) => typeof password === 'string' && password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
exports.validatePassword = validatePassword;
const bodyRequired = (...fields) => (req, res, next) => {
    const missing = fields.filter((field) => req.body?.[field] === undefined || req.body?.[field] === null || req.body[field] === '');
    if (missing.length)
        return res.status(400).json({ error: `Required fields: ${missing.join(', ')}` });
    return next();
};
exports.bodyRequired = bodyRequired;
const parseId = (value) => /^\d+$/.test(value) ? Number(value) : null;
exports.parseId = parseId;
const authFields = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body || {};
    if (!(0, exports.validateEmail)(email))
        return res.status(400).json({ error: 'A valid email is required' });
    if (!(0, exports.validatePassword)(password))
        return res.status(400).json({ error: 'Password must be at least 8 characters and include an uppercase letter and number' });
    if (req.path.endsWith('register') && (!firstName || !lastName))
        return res.status(400).json({ error: 'First and last name are required' });
    return next();
};
exports.authFields = authFields;
//# sourceMappingURL=validation.js.map