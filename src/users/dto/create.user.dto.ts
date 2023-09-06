/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  readonly password: string;
}
