import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authRepository } from '../../Infrastructure/repositories/auth.repository';
import { UserRecord, userRepository } from '../../Infrastructure/repositories/user.repository';

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

const jwtSecret = (): string => process.env.JWT_SECRET || 'development-secret-change-me';
const authError = (message: string, statusCode: number): Error & { statusCode: number } => Object.assign(new Error(message), { statusCode });
const toPublicUser = (user: UserRecord): AuthUser => ({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles: user.roles });
const createToken = (user: UserRecord, roles: string[]): string => jwt.sign({ userId: user.id, roles }, jwtSecret(), { expiresIn: '7d' });

export const authService = {
  register: async (email: string, password: string, firstName: string, lastName: string, requestedRole = 'team_member'): Promise<AuthResult> => {
    try {
      const roleName = requestedRole.trim().toLowerCase();
      if (!['team_member', 'manager'].includes(roleName)) throw authError('Invalid role. Use team_member or manager', 400);

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) throw authError('Email already registered', 409);

      const role = await authRepository.findRole(roleName);
      if (!role) throw authError(`Role '${roleName}' is not configured in the database`, 500);

      const hashedPassword = await bcrypt.hash(password, 10);
      // userRepository.create performs one transaction: users row plus user_roles row.
      const createdUser = await userRepository.create({ email, password: hashedPassword, firstName, lastName }, role.id);
      const userWithRoles = await userRepository.getUserWithRoles(createdUser.id);
      if (!userWithRoles) throw authError('Registered user could not be loaded', 500);

      const roles = await userRepository.getUserRoles(createdUser.id);
      if (!roles.length) throw authError('Role assignment failed', 500);
      console.log(`[auth] registered ${createdUser.email} with roles: ${roles.join(', ')}`);
      return { user: toPublicUser(userWithRoles), token: createToken(userWithRoles, roles) };
    } catch (error) {
      console.error('[auth service] registration failed', error);
      if ((error as { code?: string }).code === 'P2002') throw authError('Email already registered', 409);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      const user = await userRepository.findByEmail(email, true);
      if (!user?.password || !(await bcrypt.compare(password, user.password))) throw authError('Invalid email or password', 401);
      const userWithRoles = await userRepository.getUserWithRoles(user.id);
      if (!userWithRoles) throw authError('User not found', 404);
      const roles = await userRepository.getUserRoles(user.id);
      if (!roles.length) throw authError('User has no assigned roles', 403);
      await authRepository.updateLastLogin(user.id);
      return { user: toPublicUser(userWithRoles), token: createToken(userWithRoles, roles) };
    } catch (error) {
      console.error('[auth service] login failed', error);
      throw error;
    }
  },

  getUserWithRoles: async (userId: number): Promise<AuthUser> => {
    const user = await userRepository.getUserWithRoles(userId);
    if (!user) throw authError('User not found', 404);
    return toPublicUser(user);
  },

  me: async (userId: number): Promise<AuthUser> => authService.getUserWithRoles(userId),
  updateProfile: async (userId: number, data: { email: string; firstName: string; lastName: string; password?: string }): Promise<AuthUser> => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing && existing.id !== userId) throw authError('Email already registered', 409);
    const updateData: Record<string, unknown> = { email: data.email, firstName: data.firstName, lastName: data.lastName };
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    const updated = await userRepository.update(userId, updateData);
    return toPublicUser(updated);
  },
  updateLastLogin: (userId: number) => authRepository.updateLastLogin(userId),

  verifyToken: (token: string): AuthTokenPayload => {
    const payload = jwt.verify(token, jwtSecret()) as AuthTokenPayload;
    if (!payload.userId || !Array.isArray(payload.roles) || payload.roles.some((role) => typeof role !== 'string')) throw authError('Invalid authentication token', 401);
    return payload;
  },

  assignRole: async (userId: number, roleName: string, assignedBy?: number) => {
    const role = await authRepository.findRole(roleName);
    if (!role) throw authError(`Role '${roleName}' not found`, 404);
    await authRepository.assignRole(userId, role.id, assignedBy);
    return userRepository.getUserWithRoles(userId);
  },

  removeRole: async (userId: number, roleName: string) => {
    const role = await authRepository.findRole(roleName);
    if (!role) throw authError(`Role '${roleName}' not found`, 404);
    await authRepository.removeRole(userId, role.id);
    return userRepository.getUserWithRoles(userId);
  },

  hasRole: (userId: number, roleName: string) => userRepository.hasRole(userId, roleName),
};
