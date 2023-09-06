/* eslint-disable prettier/prettier */
import { User } from 'src/users/users.model';
import { UpdateUserDto } from '../dto/update.user.dto';

export async function parseUser(user: User): Promise<UpdateUserDto> {
  try {
    const parseUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarURL: user.avatarURL,
      location: user.location,
    };
    return parseUser;
  } catch (error) {
    throw new Error('Invalid user');
  }
}
