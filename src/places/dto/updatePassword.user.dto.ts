/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordUserDto {
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  readonly password: string;
}
