/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Categories } from 'src/users/dto/caterory.interface';

export class CreateOrderDto {
  @ApiProperty({ example: '+380985633225', description: 'User phone' })
  readonly phone: string;

  @ApiProperty({
    example: 'Ivan Petrov',
    description: 'Your name',
  })
  readonly name: string;

  @ApiProperty({
    example: [
      {
        _id: '65258a576f9a7d99e555c7bd',
        name: 'Музичні послуги',
        subcategories: [
          {
            name: 'Жива музика',
            id: '872c7525-ef5b-4dc3-9082-bdb98426fb1a',
          },
        ],
      },
    ],
    description: 'Order category',
  })
  readonly category: Array<Categories>;

  @ApiProperty({
    example: 'I whand music band on 20:00 today',
    description: 'Order description',
  })
  readonly description: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'User location',
  })
  readonly location: string;

  @ApiProperty({
    example: '100$',
    description: 'User price',
  })
  readonly price: string;

  @ApiProperty({
    example: '10.11.2024',
    description: 'Order data',
  })
  readonly date: string;
}
