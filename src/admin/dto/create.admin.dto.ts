/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { role } from './role.admin.dto';

export class CreateAdminDto {
  toLowerCase(): { username: string } {
    throw new Error('Method not implemented.');
  }
  @ApiProperty({
    example: 'zelenskiy',
    description: 'Admin username',
  })
  readonly username: string;

  @ApiProperty({ example: 'admin-123', description: 'Admin password' })
  readonly password: string;

  @ApiProperty({
    example: ['admin', 'moderator', 'smm', 'contentManager'],
    description: 'Admin role',
  })
  readonly role: role;
}
