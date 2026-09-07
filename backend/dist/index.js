"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./Api/routes/auth.routes"));
const analytics_routes_1 = __importDefault(require("./Api/routes/analytics.routes"));
const project_routes_1 = __importDefault(require("./Api/routes/project.routes"));
const report_routes_1 = __importDefault(require("./Api/routes/report.routes"));
const user_routes_1 = __importDefault(require("./Api/routes/user.routes"));
const prisma_1 = require("./prisma");
const app = (0, express_1.default)();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use((0, cors_1.default)({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error, _req, res, _next) => {
    const status = Number(error.statusCode || (error.code === 'P2002' ? 409 : error.code === 'P2025' ? 404 : 500));
    if (status >= 500)
        console.error(error);
    return res.status(status).json({ error: error.message || 'Internal server error' });
});
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => console.log(`API listening on port ${port}`));
const shutdown = async () => { await prisma_1.prisma.$disconnect(); server.close(() => process.exit(0)); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
exports.default = app;
//# sourceMappingURL=index.js.map