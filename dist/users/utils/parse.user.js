"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rows = exports.paginateArray = exports.mergeAndRemoveDuplicates = void 0;
function mergeAndRemoveDuplicates(...arrays) {
    const mergedArray = [].concat(...arrays);
    const uniqueArray = mergedArray.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
    const randomArray = shuffleArray(uniqueArray);
    return randomArray;
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
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
exports.rows = 'firstName email title description phone telegram viber whatsapp location master_photo avatar video photo category isOnline price verify social';
//# sourceMappingURL=parse.user.js.map