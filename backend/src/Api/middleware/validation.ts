import { NextFunction, Request, Response } from 'express';

export const validateEmail = (email: unknown): email is string => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (password: unknown): password is string => typeof password === 'string' && password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

export const bodyRequired = (...fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
	const missing = fields.filter((field) => req.body?.[field] === undefined || req.body?.[field] === null || req.body[field] === '');
	if (missing.length) return res.status(400).json({ error: `Required fields: ${missing.join(', ')}` });
	return next();
};

export const parseId = (value: string): number | null => /^\d+$/.test(value) ? Number(value) : null;

export const authFields = (req: Request, res: Response, next: NextFunction) => {
	const { email, password, firstName, lastName } = req.body || {};
	if (!validateEmail(email)) return res.status(400).json({ error: 'A valid email is required' });
	if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters and include an uppercase letter and number' });
	if (req.path.endsWith('register') && (!firstName || !lastName)) return res.status(400).json({ error: 'First and last name are required' });
	return next();
};
