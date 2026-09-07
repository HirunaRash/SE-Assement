import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from '../../Infrastructure/repositories/auth.repository';
import { userRepository } from '../../Infrastructure/repositories/user.repository';

const publicUser = (user: any, roles: string[]) => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  profilePhoto: user.profilePhoto,
  bio: user.bio,
  status: user.status,
  roles,
  createdAt: user.createdAt,
});

const tokenFor = (user: any) => jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

export const authService = {
  register: async (data: { email: string; password: string; firstName: string; lastName: string; role?: string }) => {
    if (await userRepository.findByEmail(data.email)) throw new Error('Email already registered');
    const user = await userRepository.create({ ...data, password: await bcrypt.hash(data.password, 10) });
    const roleName = data.role === 'manager' ? 'manager' : 'team_member';
    const role = await authRepository.findRole(roleName);
    if (!role) throw new Error(`Role '${roleName}' is not configured`);
    await authRepository.assignRole(user.id, role.id);
    return { token: tokenFor(user), user: publicUser(user, [roleName]) };
  },
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid email or password');
    const roles = user.userRoles.map((assignment: any) => assignment.role.name);
    await authRepository.updateLastLogin(user.id);
    return { token: tokenFor(user), user: publicUser(user, roles) };
  },
  me: async (userId: number) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return publicUser(user, user.userRoles.map((assignment: any) => assignment.role.name));
  },
};
