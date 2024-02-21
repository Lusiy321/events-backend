/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  id: string;
  @ApiProperty({ example: 'Музичні послуги', description: 'Category name' })
  readonly name: string;
}
