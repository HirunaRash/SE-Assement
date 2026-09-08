export declare const projectRepository: {
    list: () => import(".prisma/client").Prisma.PrismaPromise<({
        project_team_members: ({
            users: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            };
        } & {
            id: number;
            projectId: number;
            userId: number;
            assignedAt: Date | null;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: import(".prisma/client").$Enums.projects_status | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    })[]>;
    listForMember: (userId: number) => import(".prisma/client").Prisma.PrismaPromise<({
        project_team_members: ({
            users: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            };
        } & {
            id: number;
            projectId: number;
            userId: number;
            assignedAt: Date | null;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: import(".prisma/client").$Enums.projects_status | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    })[]>;
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__projectsClient<({
        project_team_members: ({
            users: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            };
        } & {
            id: number;
            projectId: number;
            userId: number;
            assignedAt: Date | null;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: import(".prisma/client").$Enums.projects_status | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create: (data: any) => import(".prisma/client").Prisma.Prisma__projectsClient<{
        project_team_members: ({
            users: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            };
        } & {
            id: number;
            projectId: number;
            userId: number;
            assignedAt: Date | null;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: import(".prisma/client").$Enums.projects_status | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__projectsClient<{
        project_team_members: ({
            users: {
                email: string;
                firstName: string;
                id: number;
                lastName: string;
            };
        } & {
            id: number;
            projectId: number;
            userId: number;
            assignedAt: Date | null;
        })[];
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: import(".prisma/client").$Enums.projects_status | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    delete: (id: number) => import(".prisma/client").Prisma.Prisma__projectsClient<{
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: import(".prisma/client").$Enums.projects_status | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addMember: (projectId: number, userId: number) => import(".prisma/client").Prisma.Prisma__project_team_membersClient<{
        id: number;
        projectId: number;
        userId: number;
        assignedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeMember: (projectId: number, userId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    memberExists: (projectId: number, userId: number) => import(".prisma/client").Prisma.Prisma__project_team_membersClient<{
        id: number;
        projectId: number;
        userId: number;
        assignedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    activeReportCount: (projectId: number) => import(".prisma/client").Prisma.PrismaPromise<number>;
};
//# sourceMappingURL=project.repository.d.ts.map