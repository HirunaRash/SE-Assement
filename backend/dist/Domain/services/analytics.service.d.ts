export declare const analyticsService: {
    summary: () => Promise<{
        totalReports: number;
        submittedReports: number;
        approvedReports: number;
        needsCorrection: number;
        openBlockers: number;
        complianceRate: number;
    }>;
    trends: () => Promise<{
        week: any;
        status: any;
        count: any;
    }[]>;
    teamStatus: () => Promise<{
        userId: any;
        name: string;
        email: any;
        submitted: any;
        approved: any;
        needsCorrection: any;
        draft: any;
    }[]>;
    workload: () => Promise<{
        name: string;
        value: any;
    }[]>;
    taskTime: () => Promise<{
        type: any;
        hours: number;
    }[]>;
    activity: () => Promise<{
        type: any;
        reportId: any;
        teamMember: string;
        manager: string | null;
        weekStartDate: any;
        timestamp: any;
        comment: any;
    }[]>;
};
//# sourceMappingURL=analytics.service.d.ts.map