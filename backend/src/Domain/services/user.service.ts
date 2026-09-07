import { userRepository } from '../../Infrastructure/repositories/user.repository';

export const userService = {
  list: () => userRepository.list(),
  getById: async (id: number) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  },
  update: (id: number, data: Record<string, unknown>) => userRepository.update(id, data),
  remove: async (id: number) => { await userService.getById(id); return userRepository.delete(id); },
};
