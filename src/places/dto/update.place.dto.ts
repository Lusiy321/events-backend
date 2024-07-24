/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Photo, Social } from '../../users/utils/user.types';
import { Place } from '../places.model';

export class UpdatePlaceDto {
  @ApiProperty({ example: 'Astoria', description: 'Place name' })
  readonly placeName: string;
  @ApiProperty({ example: 'My cafe', description: 'Place post title' })
  readonly title: string;
  @ApiProperty({
    example: 'I coock good food',
    description: 'Place post description',
  })
  readonly description: string;
  @ApiProperty({ example: '380984561225', description: 'Place phone' })
  readonly phone: string;
  @ApiProperty({ example: 'YourLogin', description: 'Place telegram login' })
  readonly telegram: string;
  @ApiProperty({ example: 'YourLogin', description: 'Place viber login' })
  readonly viber: string;
  @ApiProperty({
    example: '380984561225',
    description: 'Place whatsapp phone number',
  })
  readonly whatsapp: string;
  @ApiProperty({ example: 'Kyiv', description: 'Place location' })
  readonly location: string;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
    description: 'Place master photo',
  })
  readonly master_photo: Photo;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'Place master photo',
  })
  readonly avatar: Photo;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://',
    },
    description: 'User video',
  })
  readonly video: Photo[];
  @ApiProperty({
    example: [
      {
        publicId: '1',
        url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
      },
      {
        publicId: '2',
        url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
      },
    ],
    description: 'User photo',
  })
  readonly photo: Photo[];
  @ApiProperty({
    example: { Facebook: 'https://www.facebook.com/psmirnyj/' },
    description: 'User social links',
  })
  readonly social: Social;
  @ApiProperty({ example: 'true', description: 'User status' })
  readonly isOnline: boolean;
  @ApiProperty({ example: '100$', description: 'Price' })
  readonly price: string;
  @ApiProperty({ example: 'true', description: 'User paid' })
  readonly paid: boolean;
  @ApiProperty({ example: 'true', description: 'User trial period' })
  readonly trial: boolean;
  @ApiProperty({ example: 'new', description: 'User moderate status' })
  readonly verify: string;
  @ApiProperty({ example: 'false', description: 'User ban status' })
  readonly ban: boolean;
  @ApiProperty({ example: 'false', description: 'User register status' })
  readonly register: boolean;
}

export class search_place {
  totalPages: number;
  currentPage: number;
  data: Place[];
}
