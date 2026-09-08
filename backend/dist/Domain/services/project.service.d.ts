export declare const projectService: {
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
    get: (id: number) => Promise<{
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
    }>;
    create: (data: any, createdBy: number) => import(".prisma/client").Prisma.Prisma__projectsClient<{
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
    update: (id: number, data: any) => Promise<{
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
    }>;
    remove: (id: number) => Promise<void>;
    addMember: (projectId: number, userId: number) => Promise<{
        id: number;
        projectId: number;
        userId: number;
        assignedAt: Date | null;
    }>;
    removeMember: (projectId: number, userId: number) => Promise<void>;
};
//# sourceMappingURL=project.service.d.ts.map