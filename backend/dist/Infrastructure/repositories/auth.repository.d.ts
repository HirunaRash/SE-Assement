export declare const authRepository: {
    findRole: (name: string) => import(".prisma/client").Prisma.Prisma__RoleClient<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    assignRole: (userId: number, roleId: number, assignedBy?: number) => import(".prisma/client").Prisma.Prisma__UserRoleClient<{
        id: number;
        userId: number;
        roleId: number;
        assignedBy: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateLastLogin: (userId: number) => import(".prisma/client").Prisma.Prisma__UserClient<{
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
//# sourceMappingURL=auth.repository.d.ts.map