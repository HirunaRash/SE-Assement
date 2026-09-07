export declare const projectService: {
    list: () => import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            projectMembers: number;
            reports: number;
        };
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: string;
        createdBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getById: (id: number) => Promise<{
        _count: {
            projectMembers: number;
            reports: number;
        };
    } & {
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: string;
        createdBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create: (data: any) => import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: string;
        createdBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update: (id: number, data: any) => import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: string;
        createdBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: string;
        createdBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    assignMember: (projectId: number, userId: number, assignedBy: number) => import(".prisma/client").Prisma.Prisma__ProjectTeamMemberClient<{
        id: number;
        projectId: number;
        userId: number;
        assignedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeMember: (projectId: number, userId: number) => import(".prisma/client").Prisma.Prisma__ProjectTeamMemberClient<{
        id: number;
        projectId: number;
        userId: number;
        assignedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=project.service.d.ts.map