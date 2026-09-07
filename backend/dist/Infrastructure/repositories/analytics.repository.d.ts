export declare const analyticsRepository: {
    summary: () => Promise<{
        totalReports: number;
        submittedReports: number;
        approvedReports: number;
        needsCorrection: number;
        openBlockers: number;
        complianceRate: number;
    }>;
    trends: () => import(".prisma/client").Prisma.GetReportGroupByPayload<{
        by: ("status" | "weekStartDate")[];
        _count: {
            _all: true;
        };
        orderBy: {
            weekStartDate: "asc";
        };
    }>;
    teamStatus: () => import(".prisma/client").Prisma.PrismaPromise<{
        email: string;
        firstName: string;
        id: number;
        lastName: string;
        ownReports: {
            status: string;
        }[];
    }[]>;
    workload: () => import(".prisma/client").Prisma.GetReportGroupByPayload<{
        by: "projectId"[];
        _count: {
            _all: true;
        };
    }>;
    taskTime: () => import(".prisma/client").Prisma.GetReportTimeByTaskTypeGroupByPayload<{
        by: "taskType"[];
        _sum: {
            hours: true;
        };
    }>;
    activity: () => import(".prisma/client").Prisma.PrismaPromise<({
        report: {
            id: number;
            user: {
                firstName: string;
                lastName: string;
            };
            weekStartDate: Date;
        };
        reviewer: {
            firstName: string;
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
    })[]>;
};
//# sourceMappingURL=analytics.repository.d.ts.map