/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Photo } from '../users.model';

export class GoogleUserDto {
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  readonly firstName: string;

  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  readonly email: string;

  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
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
    description: 'User master photo',
  })
  readonly avatar: Photo;
}
