/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'zelenskiy',
    description: 'Admin username',
  })
  readonly username: string;

  @ApiProperty({ example: 'admin-123', description: 'Admin password' })
  readonly password: string;
}
