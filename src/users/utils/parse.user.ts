/* eslint-disable prettier/prettier */
import { User } from 'src/users/users.model';
import { UpdateUserDto } from '../dto/update.user.dto';

export async function parseUser(user: User): Promise<any> {
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
  } catch (error) {
    throw new Error('Invalid user');
  }
}

export function mergeAndRemoveDuplicates(...arrays: any[]) {
  const mergedArray = [].concat(...arrays);
  const uniqueArray = Array.from(new Set(mergedArray));
  return uniqueArray;
}

export function paginateArray(array: UpdateUserDto[], page: any) {
  const pageSize = 8;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedArray = array.slice(startIndex, endIndex);

  return paginatedArray;
}
