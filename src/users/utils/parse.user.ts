/* eslint-disable prettier/prettier */
import { User } from '../users.model';

export async function mergeAndRemoveDuplicates(...arrays: any[]) {
  const mergedArray = [].concat(...arrays);
  const uniqueArray = mergedArray.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
  );
  const randomArray = shuffleArray(uniqueArray);
  return randomArray;
}

export async function paginateArray(array: User[], page: any) {
  const pageSize = 8;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedArray = array.slice(startIndex, endIndex);

  return paginatedArray;
}

export async function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const rows =
  'firstName email title description phone telegram viber whatsapp location master_photo avatar video photo category isOnline price verify social';
