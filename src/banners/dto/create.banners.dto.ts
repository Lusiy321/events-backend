/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({ example: 'title of banner', description: 'Banner title' })
  readonly title: string;
  @ApiProperty({ example: 'https://', description: 'Banner img' })
  readonly bannerImg: string;
  @ApiProperty({ example: 'Some text of banner', description: 'Banner text' })
  readonly description: string;
  @ApiProperty({ example: 'https://', description: 'Banner URL' })
  readonly link: string;
  @ApiProperty({ example: 'go', description: 'Button Name' })
  readonly linkName: string;
}
