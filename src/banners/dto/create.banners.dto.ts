/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ example: 'https://', description: 'Banner img' })
  readonly img: string;

  @ApiProperty({ example: 'Some text of banner', description: 'Banner text' })
  readonly text: string;

  @ApiProperty({
    example: 'top',
    description: 'Banner position: enum [top, left, right]',
  })
  readonly role: string;
}
