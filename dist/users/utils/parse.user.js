"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUser = void 0;
async function parseUser(user) {
    try {
        const parseUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            master_photo: user.avatarURL,
            location: user.location,
        };
        return parseUser;
    }
    catch (error) {
        throw new Error('Invalid user');
    }
}
exports.parseUser = parseUser;
//# sourceMappingURL=parse.user.js.map