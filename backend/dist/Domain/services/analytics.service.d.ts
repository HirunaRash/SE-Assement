export declare const analyticsService: {
    teamSection: (weekStart: Date, section: 'blockers' | 'achievements') => Promise<{
        userId: any;
        name: string;
        email: any;
        reports: any;
    }[]>;
    summary: (weekStart?: Date) => Promise<{
        totalReports: number;
        submittedCount: number;
        approvedCount: number;
        needsCorrectionCount: number;
        openBlockersCount: number;
        reportsSubmitted: number;
        submittedReports: number;
        needsCorrection: number;
        complianceRate: number;
    }>;
    submissionByUser: (weekStart?: Date) => Promise<{
        userId: any;
        userName: string;
        name: string;
        submitted: any;
        approved: any;
        needsCorrection: any;
        lastSubmittedAt: any;
    }[]>;
    tasksTrend: (start?: Date, end?: Date) => Promise<{
        week: string;
        completed: number;
        pending: number;
        completedCount: number;
        total: number;
    }[]>;
    workload: () => Promise<{
        projectId: any;
        projectName: any;
        name: any;
        totalTasks: any;
        totalHours: any;
        value: any;
        hours: any;
    }[]>;
    timeByType: () => Promise<{
        taskType: any;
        totalHours: number;
        percentage: number;
    }[]>;
    recentActivity: (limit: number) => Promise<{
        type: any;
        reportId: any;
        teamMember: string;
        weekStartDate: any;
        timestamp: any;
        comment: any;
    }[]>;
    blockers: () => Promise<{
        blockerId: any;
        description: any;
        reportId: any;
        userName: string;
        daysOpen: number;
    }[]>;
};
//# sourceMappingURL=analytics.service.d.ts.map