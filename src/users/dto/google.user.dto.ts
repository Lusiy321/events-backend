/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class GoogleUserDto {
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  readonly firstName: string;

  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  readonly password: string;

  @ApiProperty({
    example: 'I1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzN',
    description: 'Google ID',
  })
  readonly googleId: string;

  @ApiProperty({ example: 'true', description: 'User email verify' })
  readonly verify_google: boolean;
}
