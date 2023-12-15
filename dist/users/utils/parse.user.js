"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rows = exports.paginateArray = exports.mergeAndRemoveDuplicates = exports.parseUser = void 0;
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
function mergeAndRemoveDuplicates(...arrays) {
    const mergedArray = [].concat(...arrays);
    const uniqueArray = Array.from(new Set(mergedArray));
    return uniqueArray;
}
exports.mergeAndRemoveDuplicates = mergeAndRemoveDuplicates;
function paginateArray(array, page) {
    const pageSize = 8;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArray = array.slice(startIndex, endIndex);
    return paginatedArray;
}
exports.paginateArray = paginateArray;
exports.rows = 'firstName email title description phone telegram whatsapp location master_photo avatar video photo category isOnline price verify';
//# sourceMappingURL=parse.user.js.map