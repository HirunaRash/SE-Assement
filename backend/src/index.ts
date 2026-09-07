import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes from Api layer
import authRoutes from './Api/routes/auth.routes';
import reportRoutes from './Api/routes/report.routes';
import projectRoutes from './Api/routes/project.routes';
import analyticsRoutes from './Api/routes/analytics.routes';
import userRoutes from './Api/routes/user.routes';

dotenv.config();

const app: Express = express();

// ============ MIDDLEWARE ============
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// ============ ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// ============ HEALTH CHECK ============
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend running' });
});

// ============ ERROR HANDLING ============
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ============ SERVER START ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

export default app;