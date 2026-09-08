export declare const analyticsService: {
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
    recentActivity: (limit: number) => import(".prisma/client").Prisma.PrismaPromise<({
        reports: {
            id: number;
        };
        users: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: number;
        reportId: number;
        reviewedBy: number | null;
        previousStatus: import(".prisma/client").$Enums.report_review_history_previousStatus | null;
        newStatus: import(".prisma/client").$Enums.report_review_history_newStatus;
        comment: string | null;
        createdAt: Date | null;
    })[]>;
    blockers: () => Promise<{
        blockerId: any;
        description: any;
        reportId: any;
        userName: string;
        daysOpen: number;
    }[]>;
};
//# sourceMappingURL=analytics.service.d.ts.map