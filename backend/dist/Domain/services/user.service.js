"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_repository_1 = require("../../Infrastructure/repositories/user.repository");
exports.userService = {
    list: () => user_repository_1.userRepository.list(),
    getById: async (id) => {
        const user = await user_repository_1.userRepository.findById(id);
        if (!user)
            throw new Error('User not found');
        return user;
    },
    update: (id, data) => user_repository_1.userRepository.update(id, data),
    remove: async (id) => { await exports.userService.getById(id); return user_repository_1.userRepository.delete(id); },
};
//# sourceMappingURL=user.service.js.map