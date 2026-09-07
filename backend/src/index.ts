import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import authRoutes from './Api/routes/auth.routes';
import analyticsRoutes from './Api/routes/analytics.routes';
import projectRoutes from './Api/routes/project.routes';
import reportRoutes from './Api/routes/report.routes';
import userRoutes from './Api/routes/user.routes';
import { prisma } from './prisma';

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
	origin: frontendUrl,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
	const status = Number(error.statusCode || (error.code === 'P2002' ? 409 : error.code === 'P2025' ? 404 : 500));
	if (status >= 500) console.error(error);
	return res.status(status).json({ error: error.message || 'Internal server error' });
});

const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => console.log(`API listening on port ${port}`));
const shutdown = async () => { await prisma.$disconnect(); server.close(() => process.exit(0)); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
