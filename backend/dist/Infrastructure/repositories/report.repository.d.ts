export declare const reportRepository: {
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__ReportClient<({
        achievements: {
            id: number;
            reportId: number;
            description: string;
            impact: string;
            isKeyAchievement: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        blockers: {
            id: number;
            reportId: number;
            description: string;
            impact: string;
            isKeyIssue: boolean;
            resolution: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextWeekTasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: string;
            estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        optionalFields: {
            id: number;
            reportId: number;
            notes: string | null;
            additionalLinks: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        project: {
            id: number;
            name: string;
            description: string | null;
            color: string | null;
            status: string;
            createdBy: number | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reviewHistory: ({
            reviewer: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            } | null;
        } & {
            id: number;
            reportId: number;
            reviewedBy: number | null;
            previousStatus: string | null;
            newStatus: string;
            comment: string | null;
            createdAt: Date;
        })[];
        tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: string;
            plannedPercentage: number;
            actualPercentage: number;
            status: string;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal;
            deliverable: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        timeByType: {
            id: number;
            reportId: number;
            taskType: string;
            hours: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }[];
        user: {
            email: string;
            firstName: string;
            id: number;
            lastName: string;
        };
        versions: ({
            tasks: {
                id: number;
                versionId: number;
                taskName: string;
                priority: string;
                plannedPercentage: number;
                actualPercentage: number;
                status: string;
                timePlannedHours: import("@prisma/client/runtime/library").Decimal;
                timeSpentHours: import("@prisma/client/runtime/library").Decimal;
                deliverable: string | null;
            }[];
        } & {
            id: number;
            reportId: number;
            versionNumber: number;
            submittedAt: Date;
            submittedBy: number | null;
            reviewCommentFromManager: string | null;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            status: string;
            createdAt: Date;
        })[];
    } & {
        id: number;
        userId: number;
        weekStartDate: Date;
        weekEndDate: Date;
        projectId: number | null;
        status: string;
        lastReviewComment: string | null;
        lastReviewedBy: number | null;
        lastReviewedAt: Date | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByUser: (userId: number) => import(".prisma/client").Prisma.PrismaPromise<({
        achievements: {
            id: number;
            reportId: number;
            description: string;
            impact: string;
            isKeyAchievement: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        blockers: {
            id: number;
            reportId: number;
            description: string;
            impact: string;
            isKeyIssue: boolean;
            resolution: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextWeekTasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: string;
            estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        optionalFields: {
            id: number;
            reportId: number;
            notes: string | null;
            additionalLinks: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        project: {
            id: number;
            name: string;
            description: string | null;
            color: string | null;
            status: string;
            createdBy: number | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reviewHistory: ({
            reviewer: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            } | null;
        } & {
            id: number;
            reportId: number;
            reviewedBy: number | null;
            previousStatus: string | null;
            newStatus: string;
            comment: string | null;
            createdAt: Date;
        })[];
        tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: string;
            plannedPercentage: number;
            actualPercentage: number;
            status: string;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal;
            deliverable: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        timeByType: {
            id: number;
            reportId: number;
            taskType: string;
            hours: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }[];
        user: {
            email: string;
            firstName: string;
            id: number;
            lastName: string;
        };
        versions: ({
            tasks: {
                id: number;
                versionId: number;
                taskName: string;
                priority: string;
                plannedPercentage: number;
                actualPercentage: number;
                status: string;
                timePlannedHours: import("@prisma/client/runtime/library").Decimal;
                timeSpentHours: import("@prisma/client/runtime/library").Decimal;
                deliverable: string | null;
            }[];
        } & {
            id: number;
            reportId: number;
            versionNumber: number;
            submittedAt: Date;
            submittedBy: number | null;
            reviewCommentFromManager: string | null;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            status: string;
            createdAt: Date;
        })[];
    } & {
        id: number;
        userId: number;
        weekStartDate: Date;
        weekEndDate: Date;
        projectId: number | null;
        status: string;
        lastReviewComment: string | null;
        lastReviewedBy: number | null;
        lastReviewedAt: Date | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findAll: (filters: {
        status?: any;
        userId?: number;
        startDate?: Date;
        endDate?: Date;
    }) => import(".prisma/client").Prisma.PrismaPromise<({
        achievements: {
            id: number;
            reportId: number;
            description: string;
            impact: string;
            isKeyAchievement: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        blockers: {
            id: number;
            reportId: number;
            description: string;
            impact: string;
            isKeyIssue: boolean;
            resolution: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextWeekTasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: string;
            estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        optionalFields: {
            id: number;
            reportId: number;
            notes: string | null;
            additionalLinks: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        project: {
            id: number;
            name: string;
            description: string | null;
            color: string | null;
            status: string;
            createdBy: number | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        reviewHistory: ({
            reviewer: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            } | null;
        } & {
            id: number;
            reportId: number;
            reviewedBy: number | null;
            previousStatus: string | null;
            newStatus: string;
            comment: string | null;
            createdAt: Date;
        })[];
        tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: string;
            plannedPercentage: number;
            actualPercentage: number;
            status: string;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal;
            deliverable: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        timeByType: {
            id: number;
            reportId: number;
            taskType: string;
            hours: import("@prisma/client/runtime/library").Decimal;
            createdAt: Date;
            updatedAt: Date;
        }[];
        user: {
            email: string;
            firstName: string;
            id: number;
            lastName: string;
        };
        versions: ({
            tasks: {
                id: number;
                versionId: number;
                taskName: string;
                priority: string;
                plannedPercentage: number;
                actualPercentage: number;
                status: string;
                timePlannedHours: import("@prisma/client/runtime/library").Decimal;
                timeSpentHours: import("@prisma/client/runtime/library").Decimal;
                deliverable: string | null;
            }[];
        } & {
            id: number;
            reportId: number;
            versionNumber: number;
            submittedAt: Date;
            submittedBy: number | null;
            reviewCommentFromManager: string | null;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            status: string;
            createdAt: Date;
        })[];
    } & {
        id: number;
        userId: number;
        weekStartDate: Date;
        weekEndDate: Date;
        projectId: number | null;
        status: string;
        lastReviewComment: string | null;
        lastReviewedBy: number | null;
        lastReviewedAt: Date | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create: (data: any) => import(".prisma/client").Prisma.Prisma__ReportClient<{
        id: number;
        userId: number;
        weekStartDate: Date;
        weekEndDate: Date;
        projectId: number | null;
        status: string;
        lastReviewComment: string | null;
        lastReviewedBy: number | null;
        lastReviewedAt: Date | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__ReportClient<{
        id: number;
        userId: number;
        weekStartDate: Date;
        weekEndDate: Date;
        projectId: number | null;
        status: string;
        lastReviewComment: string | null;
        lastReviewedBy: number | null;
        lastReviewedAt: Date | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete: (id: number) => import(".prisma/client").Prisma.Prisma__ReportClient<{
        id: number;
        userId: number;
        weekStartDate: Date;
        weekEndDate: Date;
        projectId: number | null;
        status: string;
        lastReviewComment: string | null;
        lastReviewedBy: number | null;
        lastReviewedAt: Date | null;
        submittedAt: Date | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addTask: (data: any) => import(".prisma/client").Prisma.Prisma__ReportTaskClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: string;
        plannedPercentage: number;
        actualPercentage: number;
        status: string;
        timePlannedHours: import("@prisma/client/runtime/library").Decimal;
        timeSpentHours: import("@prisma/client/runtime/library").Decimal;
        deliverable: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTask: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__ReportTaskClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: string;
        plannedPercentage: number;
        actualPercentage: number;
        status: string;
        timePlannedHours: import("@prisma/client/runtime/library").Decimal;
        timeSpentHours: import("@prisma/client/runtime/library").Decimal;
        deliverable: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteTask: (id: number) => import(".prisma/client").Prisma.Prisma__ReportTaskClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: string;
        plannedPercentage: number;
        actualPercentage: number;
        status: string;
        timePlannedHours: import("@prisma/client/runtime/library").Decimal;
        timeSpentHours: import("@prisma/client/runtime/library").Decimal;
        deliverable: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createReview: (data: any) => import(".prisma/client").Prisma.Prisma__ReportReviewHistoryClient<{
        id: number;
        reportId: number;
        reviewedBy: number | null;
        previousStatus: string | null;
        newStatus: string;
        comment: string | null;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createVersion: (data: any) => import(".prisma/client").Prisma.Prisma__ReportVersionClient<{
        id: number;
        reportId: number;
        versionNumber: number;
        submittedAt: Date;
        submittedBy: number | null;
        reviewCommentFromManager: string | null;
        reviewedBy: number | null;
        reviewedAt: Date | null;
        status: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addBlocker: (data: any) => import(".prisma/client").Prisma.Prisma__ReportBlockerClient<{
        id: number;
        reportId: number;
        description: string;
        impact: string;
        isKeyIssue: boolean;
        resolution: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addAchievement: (data: any) => import(".prisma/client").Prisma.Prisma__ReportAchievementClient<{
        id: number;
        reportId: number;
        description: string;
        impact: string;
        isKeyAchievement: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addNextWeekTask: (data: any) => import(".prisma/client").Prisma.Prisma__ReportNextWeekTaskClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: string;
        estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    setOptionalFields: (reportId: number, data: any) => import(".prisma/client").Prisma.Prisma__ReportOptionalFieldsClient<{
        id: number;
        reportId: number;
        notes: string | null;
        additionalLinks: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=report.repository.d.ts.map