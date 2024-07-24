/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class MailUserDto {
  @ApiProperty({ example: 'example@mail.com', description: 'User email' })
  readonly email: string;
}
