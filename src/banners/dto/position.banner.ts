/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export enum place {
  top = 'top',
  left = 'left',
  right = 'right',
}

export class PositionInterface {
  @ApiProperty({
    example: 'top',
    description: 'Banner position',
  })
  readonly position: place;
}
