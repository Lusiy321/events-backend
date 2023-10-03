/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: '651bc16a72a4d2b5fbeb6f45',
    description: 'Category ID',
  })
  id: string;
  @ApiProperty({ example: 'Music', description: 'Category name' })
  readonly name: string;
}
