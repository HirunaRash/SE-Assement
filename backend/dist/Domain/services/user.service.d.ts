export declare const userService: {
    list: (role: string | undefined, skip: number, take: number) => Promise<{
        items: import("../../Infrastructure/repositories/user.repository").UserRecord[];
        total: number;
    }>;
    create: (data: any, assignedBy: number) => Promise<import("../../Infrastructure/repositories/user.repository").UserRecord | null>;
    update: (id: number, data: any) => Promise<import("../../Infrastructure/repositories/user.repository").UserRecord>;
    remove: (id: number) => Promise<void>;
    setRole: (id: number, roleName: string, assignedBy: number) => Promise<import("../../Infrastructure/repositories/user.repository").UserRecord | null>;
};
//# sourceMappingURL=user.service.d.ts.map