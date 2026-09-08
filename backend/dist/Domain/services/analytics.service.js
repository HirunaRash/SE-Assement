"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const analytics_repository_1 = require("../../Infrastructure/repositories/analytics.repository");
exports.analyticsService = {
    teamSection: async (weekStart, section) => (await analytics_repository_1.analyticsRepository.teamSection(weekStart, section)).map((member) => ({
        userId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        reports: member.reports_reports_userIdTousers.map((report) => ({
            reportId: report.id,
            projectName: report.projects?.name || 'No project',
            entries: section === 'blockers' ? report.report_blockers : report.report_achievements,
        })),
    })),
    summary: async (weekStart) => { const result = await analytics_repository_1.analyticsRepository.summary(weekStart); return { ...result, reportsSubmitted: result.submittedCount, submittedReports: result.submittedCount, needsCorrection: result.needsCorrectionCount, complianceRate: result.totalReports ? Math.round((result.approvedCount / result.totalReports) * 100) : 0 }; },
    submissionByUser: async (weekStart) => (await analytics_repository_1.analyticsRepository.submissionByUser(weekStart)).map((user) => { const reports = user.reports_reports_userIdTousers || []; const count = (status) => reports.filter((report) => report.status === status).length; const latest = [...reports].sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime())[0]; return { userId: user.id, userName: `${user.firstName} ${user.lastName}`, name: `${user.firstName} ${user.lastName}`, submitted: count('submitted'), approved: count('approved'), needsCorrection: count('needs_correction'), lastSubmittedAt: latest?.submittedAt || null }; }),
    tasksTrend: async (start, end) => { const rows = await analytics_repository_1.analyticsRepository.taskTrend(start, end); const byWeek = new Map(); rows.forEach((row) => { const week = row.createdAt?.toISOString().slice(0, 10) || 'unknown'; const item = byWeek.get(week) || { completedCount: 0, pendingCount: 0 }; row.status === 'completed' ? item.completedCount++ : item.pendingCount++; byWeek.set(week, item); }); return [...byWeek].map(([week, values]) => ({ week, completed: values.completedCount, pending: values.pendingCount, completedCount: values.completedCount, total: values.completedCount + values.pendingCount })); },
    workload: async () => (await analytics_repository_1.analyticsRepository.workload()).map((project) => { const tasks = project.reports.flatMap((report) => report.report_tasks); const totalHours = tasks.reduce((sum, task) => sum + Number(task.timeSpentHours || task.timePlannedHours || 0), 0); return { projectId: project.id, projectName: project.name, name: project.name, totalTasks: tasks.length, totalHours, value: tasks.length, hours: totalHours }; }),
    timeByType: async () => { const rows = await analytics_repository_1.analyticsRepository.timeByType(); const total = rows.reduce((sum, row) => sum + Number(row._sum.hours || 0), 0); return rows.map((row) => ({ taskType: row.taskType, totalHours: Number(row._sum.hours || 0), percentage: total ? Math.round(Number(row._sum.hours || 0) / total * 100) : 0 })); },
    recentActivity: async (limit) => (await analytics_repository_1.analyticsRepository.recentActivity(limit)).map((activity) => ({
        type: activity.newStatus,
        reportId: activity.reports?.id || activity.reportId,
        teamMember: activity.reports?.users_reports_userIdTousers ? `${activity.reports.users_reports_userIdTousers.firstName} ${activity.reports.users_reports_userIdTousers.lastName}` : 'Team member',
        weekStartDate: activity.reports?.weekStartDate,
        timestamp: activity.createdAt,
        comment: activity.comment,
    })),
    blockers: async () => (await analytics_repository_1.analyticsRepository.blockers()).map((blocker) => ({ blockerId: blocker.id, description: blocker.description, reportId: blocker.reportId, userName: `${blocker.reports.users_reports_userIdTousers.firstName} ${blocker.reports.users_reports_userIdTousers.lastName}`, daysOpen: Math.floor((Date.now() - new Date(blocker.createdAt || Date.now()).getTime()) / 86400000) })),
};
//# sourceMappingURL=analytics.service.js.map