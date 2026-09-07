export declare const reportRepository: {
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__reportsClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findMine: (userId: number, where: any, skip: number, take: number) => import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    findAll: (where: any, skip: number, take: number) => import(".prisma/client").Prisma.PrismaPromise<({
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
    })[]>;
    count: (where: any) => import(".prisma/client").Prisma.PrismaPromise<number>;
    create: (data: any) => import(".prisma/client").Prisma.Prisma__reportsClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__reportsClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    task: (data: any) => import(".prisma/client").Prisma.Prisma__report_tasksClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateTask: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__report_tasksClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteTask: (id: number) => import(".prisma/client").Prisma.Prisma__report_tasksClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    blocker: (data: any) => import(".prisma/client").Prisma.Prisma__report_blockersClient<{
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_blockers_impact | null;
        isKeyIssue: boolean | null;
        resolution: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateBlocker: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__report_blockersClient<{
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_blockers_impact | null;
        isKeyIssue: boolean | null;
        resolution: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteBlocker: (id: number) => import(".prisma/client").Prisma.Prisma__report_blockersClient<{
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_blockers_impact | null;
        isKeyIssue: boolean | null;
        resolution: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    achievement: (data: any) => import(".prisma/client").Prisma.Prisma__report_achievementsClient<{
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_achievements_impact | null;
        isKeyAchievement: boolean | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateAchievement: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__report_achievementsClient<{
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_achievements_impact | null;
        isKeyAchievement: boolean | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteAchievement: (id: number) => import(".prisma/client").Prisma.Prisma__report_achievementsClient<{
        id: number;
        reportId: number;
        description: string;
        impact: import(".prisma/client").$Enums.report_achievements_impact | null;
        isKeyAchievement: boolean | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    nextTask: (data: any) => import(".prisma/client").Prisma.Prisma__report_next_week_tasksClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: import(".prisma/client").$Enums.report_next_week_tasks_priority | null;
        estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateNextTask: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__report_next_week_tasksClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: import(".prisma/client").$Enums.report_next_week_tasks_priority | null;
        estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteNextTask: (id: number) => import(".prisma/client").Prisma.Prisma__report_next_week_tasksClient<{
        id: number;
        reportId: number;
        taskName: string;
        priority: import(".prisma/client").$Enums.report_next_week_tasks_priority | null;
        estimatedHours: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    time: (data: any) => import(".prisma/client").Prisma.Prisma__report_time_by_task_typeClient<{
        id: number;
        reportId: number;
        taskType: string;
        hours: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    version: (data: any) => import(".prisma/client").Prisma.Prisma__report_versionsClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    versions: (reportId: number) => import(".prisma/client").Prisma.PrismaPromise<({
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
    versionByNumber: (reportId: number, versionNumber: number) => import(".prisma/client").Prisma.Prisma__report_versionsClient<({
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
    reviewHistory: (reportId: number) => import(".prisma/client").Prisma.PrismaPromise<({
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
    review: (data: any) => import(".prisma/client").Prisma.Prisma__report_review_historyClient<{
        id: number;
        reportId: number;
        reviewedBy: number | null;
        previousStatus: import(".prisma/client").$Enums.report_review_history_previousStatus | null;
        newStatus: import(".prisma/client").$Enums.report_review_history_newStatus;
        comment: string | null;
        createdAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=report.repository.d.ts.map