export declare const reportService: {
    listMine: (userId: number, status: string | undefined, skip: number, take: number, startDate?: string, endDate?: string) => Promise<{
        items: ({
            projects: {
                id: number;
                name: string;
                description: string | null;
                color: string | null;
                status: import(".prisma/client").$Enums.projects_status | null;
                createdBy: number | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            } | null;
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
        })[];
        total: number;
    }>;
    listAll: (filters: any, skip: number, take: number) => Promise<{
        items: ({
            projects: {
                id: number;
                name: string;
                description: string | null;
                color: string | null;
                status: import(".prisma/client").$Enums.projects_status | null;
                createdBy: number | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            } | null;
            users_reports_userIdTousers: {
                firstName: string;
                id: number;
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
        })[];
        total: number;
    }>;
    get: (id: number, userId: number, manager: boolean) => Promise<any>;
    create: (userId: number, data: any) => Promise<{
        projects: {
            id: number;
            name: string;
            description: string | null;
            color: string | null;
            status: import(".prisma/client").$Enums.projects_status | null;
            createdBy: number | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        } | null;
        report_achievements: {
            id: number;
            reportId: number;
            description: string;
            impact: import(".prisma/client").$Enums.report_achievements_impact | null;
            isKeyAchievement: boolean | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_blockers: {
            id: number;
            reportId: number;
            description: string;
            impact: import(".prisma/client").$Enums.report_blockers_impact | null;
            isKeyIssue: boolean | null;
            resolution: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_next_week_tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: import(".prisma/client").$Enums.report_next_week_tasks_priority | null;
            estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_optional_fields: {
            id: number;
            reportId: number;
            notes: string | null;
            additionalLinks: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_review_history: ({
            users: {
                firstName: string;
                id: number;
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
        })[];
        report_tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: import(".prisma/client").$Enums.report_tasks_priority | null;
            plannedPercentage: number | null;
            actualPercentage: number | null;
            status: import(".prisma/client").$Enums.report_tasks_status | null;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
            deliverable: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_time_by_task_type: {
            id: number;
            reportId: number;
            taskType: string;
            hours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_versions: ({
            report_version_tasks: {
                id: number;
                versionId: number;
                taskName: string;
                priority: import(".prisma/client").$Enums.report_version_tasks_priority | null;
                plannedPercentage: number | null;
                actualPercentage: number | null;
                status: import(".prisma/client").$Enums.report_version_tasks_status | null;
                timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
                timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
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
            status: import(".prisma/client").$Enums.report_versions_status;
            createdAt: Date | null;
        })[];
        users_reports_userIdTousers: {
            email: string;
            firstName: string;
            id: number;
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
    }>;
    update: (id: number, userId: number, data: any) => Promise<({
        projects: {
            id: number;
            name: string;
            description: string | null;
            color: string | null;
            status: import(".prisma/client").$Enums.projects_status | null;
            createdBy: number | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        } | null;
        report_achievements: {
            id: number;
            reportId: number;
            description: string;
            impact: import(".prisma/client").$Enums.report_achievements_impact | null;
            isKeyAchievement: boolean | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_blockers: {
            id: number;
            reportId: number;
            description: string;
            impact: import(".prisma/client").$Enums.report_blockers_impact | null;
            isKeyIssue: boolean | null;
            resolution: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_next_week_tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: import(".prisma/client").$Enums.report_next_week_tasks_priority | null;
            estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_optional_fields: {
            id: number;
            reportId: number;
            notes: string | null;
            additionalLinks: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_review_history: ({
            users: {
                firstName: string;
                id: number;
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
        })[];
        report_tasks: {
            id: number;
            reportId: number;
            taskName: string;
            priority: import(".prisma/client").$Enums.report_tasks_priority | null;
            plannedPercentage: number | null;
            actualPercentage: number | null;
            status: import(".prisma/client").$Enums.report_tasks_status | null;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
            deliverable: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_time_by_task_type: {
            id: number;
            reportId: number;
            taskType: string;
            hours: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }[];
        report_versions: ({
            report_version_tasks: {
                id: number;
                versionId: number;
                taskName: string;
                priority: import(".prisma/client").$Enums.report_version_tasks_priority | null;
                plannedPercentage: number | null;
                actualPercentage: number | null;
                status: import(".prisma/client").$Enums.report_version_tasks_status | null;
                timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
                timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
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
            status: import(".prisma/client").$Enums.report_versions_status;
            createdAt: Date | null;
        })[];
        users_reports_userIdTousers: {
            email: string;
            firstName: string;
            id: number;
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
    }) | null>;
    submit: (id: number, userId: number) => Promise<{
        status: string;
    }>;
    addTask: (id: number, userId: number, data: any) => Promise<{
        id: number;
        reportId: number;
        taskName: string;
        priority: import(".prisma/client").$Enums.report_tasks_priority | null;
        plannedPercentage: number | null;
        actualPercentage: number | null;
        status: import(".prisma/client").$Enums.report_tasks_status | null;
        timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
        timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
        deliverable: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    updateTask: (id: number, taskId: number, userId: number, data: any) => Promise<{
        id: number;
        reportId: number;
        taskName: string;
        priority: import(".prisma/client").$Enums.report_tasks_priority | null;
        plannedPercentage: number | null;
        actualPercentage: number | null;
        status: import(".prisma/client").$Enums.report_tasks_status | null;
        timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
        timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
        deliverable: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    deleteTask: (id: number, taskId: number, userId: number) => Promise<void>;
    child: (kind: string, id: number, userId: number, data: any, childId?: number) => Promise<any>;
    deleteChild: (kind: string, id: number, userId: number, childId: number) => Promise<void>;
    addTime: (id: number, userId: number, data: any) => Promise<{
        id: number;
        reportId: number;
        taskType: string;
        hours: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    review: (id: number, reviewerId: number, status: 'approved' | 'needs_correction', comment?: string) => Promise<{
        status: "approved" | "needs_correction";
        comment?: string | undefined;
    }>;
    versions: (id: number) => import(".prisma/client").Prisma.PrismaPromise<({
        report_version_tasks: {
            id: number;
            versionId: number;
            taskName: string;
            priority: import(".prisma/client").$Enums.report_version_tasks_priority | null;
            plannedPercentage: number | null;
            actualPercentage: number | null;
            status: import(".prisma/client").$Enums.report_version_tasks_status | null;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
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
        status: import(".prisma/client").$Enums.report_versions_status;
        createdAt: Date | null;
    })[]>;
    version: (id: number, version: number) => import(".prisma/client").Prisma.Prisma__report_versionsClient<({
        report_version_tasks: {
            id: number;
            versionId: number;
            taskName: string;
            priority: import(".prisma/client").$Enums.report_version_tasks_priority | null;
            plannedPercentage: number | null;
            actualPercentage: number | null;
            status: import(".prisma/client").$Enums.report_version_tasks_status | null;
            timePlannedHours: import("@prisma/client/runtime/library").Decimal | null;
            timeSpentHours: import("@prisma/client/runtime/library").Decimal | null;
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
        status: import(".prisma/client").$Enums.report_versions_status;
        createdAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    history: (id: number) => import(".prisma/client").Prisma.PrismaPromise<({
        users: {
            firstName: string;
            id: number;
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
};
//# sourceMappingURL=report.service.d.ts.map