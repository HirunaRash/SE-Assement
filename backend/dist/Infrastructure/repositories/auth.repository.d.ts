export declare const authRepository: {
    findRole: (name: string) => Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null>;
    assignRole: (userId: number, roleId: number, assignedBy?: number) => Promise<{
        id: number;
        userId: number;
        roleId: number;
        assignedBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    removeRole: (userId: number, roleId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    updateLastLogin: (userId: number) => import(".prisma/client").Prisma.Prisma__usersClient<{
        id: number;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        bio: string | null;
        status: import(".prisma/client").$Enums.users_status | null;
        lastLogin: Date | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=auth.repository.d.ts.map