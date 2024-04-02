/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLiveDto {
  @ApiProperty({ example: 'Some text', description: 'Users text of post' })
  readonly content: string;
  @ApiPropertyOptional({ example: 'https://', description: 'Img URL' })
  readonly image?: string;
}
