/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangeDto {
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  readonly oldPassword: string;
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  readonly password: string;
}
