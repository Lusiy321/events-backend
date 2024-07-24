/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangePlaceDto {
  @ApiProperty({ example: 'Astoria-123545', description: 'Place old password' })
  readonly oldPassword: string;
  @ApiProperty({ example: 'Astoria-123545', description: 'Place password' })
  readonly password: string;
}
