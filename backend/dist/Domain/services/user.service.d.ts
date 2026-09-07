export declare const userService: {
    list: () => import(".prisma/client").Prisma.PrismaPromise<{
        bio: string | null;
        createdAt: Date;
        email: string;
        firstName: string;
        id: number;
        lastLogin: Date | null;
        lastName: string;
        profilePhoto: string | null;
        status: string;
        updatedAt: Date;
    }[]>;
    getById: (id: number) => Promise<{
        userRoles: ({
            role: {
                id: number;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            userId: number;
            roleId: number;
            assignedBy: number | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    } & {
        id: number;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        bio: string | null;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update: (id: number, data: Record<string, unknown>) => import(".prisma/client").Prisma.Prisma__UserClient<{
        id: number;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        bio: string | null;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove: (id: number) => Promise<{
        id: number;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        bio: string | null;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map