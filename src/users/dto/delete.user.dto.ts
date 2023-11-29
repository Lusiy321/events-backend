/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class DelUserMediaDto {
  @ApiProperty({
    example:
      'user-64ff012f1424c2d37e2d0467/6D47C938-D9A3-49CA-A9F3-35E84083DCDB_1_201_a-1701253649865.jpeg',
    description: 'Delete object',
  })
  readonly id: string;
}
