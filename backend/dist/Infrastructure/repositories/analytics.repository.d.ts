export declare const analyticsRepository: {
    summary: (weekStart?: Date) => Promise<{
        totalReports: number;
        submittedCount: number;
        approvedCount: number;
        needsCorrectionCount: number;
        openBlockersCount: number;
    }>;
    submissionByUser: (weekStart?: Date) => import(".prisma/client").Prisma.PrismaPromise<{
        firstName: string;
        id: number;
        lastName: string;
        reports_reports_userIdTousers: {
            status: import(".prisma/client").$Enums.reports_status | null;
            submittedAt: Date | null;
        }[];
    }[]>;
    taskTrend: (startDate?: Date, endDate?: Date) => import(".prisma/client").Prisma.PrismaPromise<{
        createdAt: Date | null;
        status: import(".prisma/client").$Enums.report_tasks_status | null;
    }[]>;
    workload: () => import(".prisma/client").Prisma.PrismaPromise<{
        id: number;
        name: string;
        reports: {
            report_tasks: {
                status: import(".prisma/client").$Enums.report_tasks_status | null;
                timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
                timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
            }[];
        }[];
    }[]>;
    timeByType: () => import(".prisma/client").Prisma.GetReport_time_by_task_typeGroupByPayload<{
        by: "taskType"[];
        _sum: {
            hours: true;
        };
    }>;
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
    blockers: () => import(".prisma/client").Prisma.PrismaPromise<({
        reports: {
            users_reports_userIdTousers: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            userId: number;
            weekStartDate: Date;
            weekEndDate: Date;
            projectId: number | null;
            status: import(".prisma/client").$Enums.reports_status | null;
            lastReviewComment: string | null;
            lastReviewedBy: number | null;
            lastReviewedAt: Date | null;
            submittedAt: Date | null;
            approvedAt: Date | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        };
    } & {
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_blockers_impact | null;
        isKeyIssue: boolean | null;
        resolution: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    })[]>;
};
//# sourceMappingURL=analytics.repository.d.ts.map