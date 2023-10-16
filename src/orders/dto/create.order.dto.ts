/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '+380985633225', description: 'User phone' })
  readonly phone: string;
}
