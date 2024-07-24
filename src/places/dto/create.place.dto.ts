/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty({ example: 'astoria@gmail.com', description: 'Place email' })
  readonly email: string;
  @ApiProperty({ example: 'Cafe-123545', description: 'Place password' })
  readonly password: string;
  @ApiProperty({ example: 'Astoria restoran', description: 'Place name' })
  readonly placeName: string;
  @ApiProperty({
    example: '380987894556',
    description: 'Place phone number',
  })
  readonly phone: string;
}
