export declare const userRepository: {
    findById: (id: number) => import(".prisma/client").Prisma.Prisma__UserClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEmail: (email: string) => import(".prisma/client").Prisma.Prisma__UserClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    getRoleNames: (userId: number) => Promise<string[]>;
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
    create: (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
        bio?: string;
    }) => import(".prisma/client").Prisma.Prisma__UserClient<{
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
    delete: (id: number) => import(".prisma/client").Prisma.Prisma__UserClient<{
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
};
//# sourceMappingURL=user.repository.d.ts.map