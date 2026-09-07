import { JwtPayload } from 'jsonwebtoken';
import { UserRecord } from '../../Infrastructure/repositories/user.repository';
export interface AuthUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}
export interface AuthResult {
    user: AuthUser;
    token: string;
}
export interface AuthTokenPayload extends JwtPayload {
    userId: number;
    roles: string[];
}
export declare const authService: {
    register: (email: string, password: string, firstName: string, lastName: string, requestedRole?: string) => Promise<AuthResult>;
    login: (email: string, password: string) => Promise<AuthResult>;
    getUserWithRoles: (userId: number) => Promise<AuthUser>;
    me: (userId: number) => Promise<AuthUser>;
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
    verifyToken: (token: string) => AuthTokenPayload;
    assignRole: (userId: number, roleName: string, assignedBy?: number) => Promise<UserRecord | null>;
    removeRole: (userId: number, roleName: string) => Promise<UserRecord | null>;
    hasRole: (userId: number, roleName: string) => Promise<boolean>;
};
//# sourceMappingURL=auth.service.d.ts.map