/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum role {
  superadmin = 'superadmin',
  admin = 'admin',
  user = 'smm',
  moderator = 'moderator',
}

export class RoleAdminDto {
  @ApiProperty({ example: 'moderator', description: 'admin role' })
  readonly role: role;
}
