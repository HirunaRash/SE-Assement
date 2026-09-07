export declare const projectRepository: {
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
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__ProjectClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
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
    delete: (id: number) => import(".prisma/client").Prisma.Prisma__ProjectClient<{
        id: number;
        name: string;
        description: string | null;
        color: string | null;
        status: string;
        createdBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    assignMember: (projectId: number, userId: number, _assignedBy: number) => import(".prisma/client").Prisma.Prisma__ProjectTeamMemberClient<{
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
//# sourceMappingURL=project.repository.d.ts.map