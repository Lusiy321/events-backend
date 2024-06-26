/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum verify {
  new = 'new',
  approve = 'approve',
  rejected = 'rejected',
}

export class VerifyUserDto {
  @ApiProperty({
    example: 'approve',
    description: 'User verify',
  })
  readonly verified: string;
}
