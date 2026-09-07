"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes from Api layer
const auth_routes_1 = __importDefault(require("./Api/routes/auth.routes"));
const report_routes_1 = __importDefault(require("./Api/routes/report.routes"));
const project_routes_1 = __importDefault(require("./Api/routes/project.routes"));
const analytics_routes_1 = __importDefault(require("./Api/routes/analytics.routes"));
const user_routes_1 = __importDefault(require("./Api/routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ============ MIDDLEWARE ============
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
// ============ ROUTES ============
app.use('/api/auth', auth_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/users', user_routes_1.default);
// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend running' });
});
// ============ ERROR HANDLING ============
app.use((err, req, res, next) => {
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
exports.default = app;
//# sourceMappingURL=index.js.map