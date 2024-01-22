/* eslint-disable prettier/prettier */
import { UpdateUserDto } from '../dto/update.user.dto';

export function mergeAndRemoveDuplicates(...arrays: any[]) {
  const mergedArray = [].concat(...arrays);
  const uniqueArray = mergedArray.filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
  );
  return uniqueArray;
}

export function paginateArray(array: UpdateUserDto[], page: any) {
  const pageSize = 8;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedArray = array.slice(startIndex, endIndex);

  return paginatedArray;
}

export const rows =
  'firstName email title description phone telegram whatsapp location master_photo avatar video photo category isOnline price verify social';
