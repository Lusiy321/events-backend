"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rows = exports.paginateArray = exports.mergeAndRemoveDuplicates = void 0;
function mergeAndRemoveDuplicates(...arrays) {
    const mergedArray = [].concat(...arrays);
    const uniqueArray = mergedArray.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
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
exports.rows = 'firstName email title description phone telegram whatsapp location master_photo avatar video photo category isOnline price verify social';
//# sourceMappingURL=parse.user.js.map