/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Photo } from '../../users/utils/user.types';

export class GooglePlaceDto {
  @ApiProperty({ example: 'Astoria', description: 'Place name' })
  readonly placeName: string;

  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'Place email' })
  readonly email: string;

  @ApiProperty({ example: 'Vovan-123545', description: 'Place password' })
  readonly password: string;

  @ApiProperty({
    example: 'I1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzN',
    description: 'Google ID',
  })
  readonly googleId: string;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'Place admin master photo',
  })
  readonly avatar: Photo;
}
