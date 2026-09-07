export interface UserRecord {
    id: number;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string | null;
    bio?: string | null;
    status?: string | null;
    lastLogin?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    roles: string[];
    userRoles: unknown[];
}
export interface UserCreateData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    bio?: string;
}
export declare const userRepository: {
    findById: (id: number) => Promise<UserRecord | null>;
    findByEmail: (email: string, includePassword?: boolean) => Promise<UserRecord | null>;
    list: (where?: any, skip?: number, take?: number) => Promise<UserRecord[]>;
    count: (where?: any) => import(".prisma/client").Prisma.PrismaPromise<number>;
    create: (data: UserCreateData, roleId?: number, assignedBy?: number) => Promise<UserRecord>;
    update: (id: number, data: Record<string, unknown>) => Promise<UserRecord>;
    delete: (id: number) => import(".prisma/client").Prisma.Prisma__usersClient<{
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
    getUserWithRoles: (userId: number) => Promise<UserRecord | null>;
    getUserRoles: (userId: number) => Promise<string[]>;
    hasRole: (userId: number, roleName: string) => Promise<boolean>;
    role: (name: string) => import(".prisma/client").Prisma.Prisma__rolesClient<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    assignRole: (userIdOrData: number | {
        userId: number;
        roleId: number;
        assignedBy?: number;
    }, roleId?: number, assignedBy?: number) => Promise<{
        id: number;
        userId: number;
        roleId: number;
        assignedBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }>;
    removeRole: (userId: number, roleId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    removeRoles: (userId: number) => import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=user.repository.d.ts.map