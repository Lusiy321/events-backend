/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'It is a new post of more interesting information',
    description: 'Post title',
  })
  readonly title: string;

  @ApiProperty({
    example: 'I whand music band on my restoran',
    description: 'Post description',
  })
  readonly description: string;

  @ApiProperty({
    example: [
      { publicId: '1', url: 'https://' },
      { publicId: '2', url: 'https://' },
    ],
    description: 'Post images',
  })
  readonly img: Array<string>;
}
