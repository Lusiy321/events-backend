/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType('PasswordUser')
export class PasswordUserDto {
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  @Field()
  readonly password: string;
}
