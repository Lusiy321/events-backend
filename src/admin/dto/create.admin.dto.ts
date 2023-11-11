/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

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
}
