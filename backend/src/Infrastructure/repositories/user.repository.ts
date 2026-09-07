import { prisma } from '../../prisma';

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

const userInclude = {
  user_roles_user_roles_userIdTousers: { include: { roles: true } },
} as const;

type LoadedUser = any;

const transformUser = (user: LoadedUser | null, includePassword = false): UserRecord | null => {
  if (!user) return null;
  const userRoles = user.user_roles_user_roles_userIdTousers || [];
  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    ...(includePassword ? { password } : {}),
    roles: userRoles.map((assignment: any) => assignment.roles.name),
    userRoles,
  };
};

const transformUsers = (users: LoadedUser[]): UserRecord[] => users.map((user) => transformUser(user)).filter((user): user is UserRecord => user !== null);

export const userRepository = {
  findById: async (id: number): Promise<UserRecord | null> => transformUser(await prisma.users.findUnique({ where: { id }, include: userInclude })),

  findByEmail: async (email: string, includePassword = false): Promise<UserRecord | null> => transformUser(await prisma.users.findUnique({ where: { email }, include: userInclude }), includePassword),

  list: async (where: any = {}, skip = 0, take = 20): Promise<UserRecord[]> => transformUsers(await prisma.users.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: userInclude })),

  count: (where: any = {}) => prisma.users.count({ where }),

  create: async (data: UserCreateData, roleId?: number, assignedBy?: number): Promise<UserRecord> => {
    const user = await prisma.$transaction(async (transaction) => {
      const created = await transaction.users.create({ data });
      if (roleId !== undefined) {
        await transaction.user_roles.create({ data: { userId: created.id, roleId, assignedBy } });
      }
      return transaction.users.findUnique({ where: { id: created.id }, include: userInclude });
    });
    const transformed = transformUser(user);
    if (!transformed) throw new Error('Created user could not be loaded');
    return transformed;
  },

  update: async (id: number, data: Record<string, unknown>): Promise<UserRecord> => {
    const user = await prisma.users.update({ where: { id }, data, include: userInclude });
    const transformed = transformUser(user);
    if (!transformed) throw new Error('Updated user could not be loaded');
    return transformed;
  },

  delete: (id: number) => prisma.users.delete({ where: { id } }),

  getUserWithRoles: async (userId: number): Promise<UserRecord | null> => transformUser(await prisma.users.findUnique({ where: { id: userId }, include: userInclude })),

  getUserRoles: async (userId: number): Promise<string[]> => {
    const user = await prisma.users.findUnique({ where: { id: userId }, include: userInclude });
    return transformUser(user)?.roles || [];
  },

  hasRole: async (userId: number, roleName: string): Promise<boolean> => (await userRepository.getUserRoles(userId)).includes(roleName),

  role: (name: string) => prisma.roles.findUnique({ where: { name } }),

  assignRole: async (userIdOrData: number | { userId: number; roleId: number; assignedBy?: number }, roleId?: number, assignedBy?: number) => {
    const data = typeof userIdOrData === 'number' ? { userId: userIdOrData, roleId: roleId!, assignedBy } : userIdOrData;
    return prisma.user_roles.upsert({ where: { userId_roleId: { userId: data.userId, roleId: data.roleId } }, create: data, update: {} });
  },

  removeRole: (userId: number, roleId: number) => prisma.user_roles.deleteMany({ where: { userId, roleId } }),

  removeRoles: (userId: number) => prisma.user_roles.deleteMany({ where: { userId } }),
};
