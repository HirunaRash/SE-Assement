export declare const authService: {
    register: (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
    }) => Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            profilePhoto: any;
            bio: any;
            status: any;
            roles: string[];
            createdAt: any;
        };
    }>;
    login: (email: string, password: string) => Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            profilePhoto: any;
            bio: any;
            status: any;
            roles: string[];
            createdAt: any;
        };
    }>;
    me: (userId: number) => Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        profilePhoto: any;
        bio: any;
        status: any;
        roles: string[];
        createdAt: any;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map