/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateUserDto {
  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  @Field()
  readonly email: string;
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  @Field()
  readonly password: string;
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  @Field()
  readonly firstName: string;
  @ApiProperty({
    example: '380987894556',
    description: 'User phone number',
  })
  @Field()
  readonly phone: string;
}
