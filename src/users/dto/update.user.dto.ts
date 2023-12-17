/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Photo, Social } from '../users.model';
import { Categories } from './caterory.interface';
import { verify } from './verify.user.dto';

export class UpdateUserDto {
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  readonly firstName: string;
  @ApiProperty({ example: 'My music work', description: 'User post title' })
  readonly title: string;
  @ApiProperty({ example: 'I sing song', description: 'User post description' })
  readonly description: string;
  @ApiProperty({ example: '380984561225', description: 'User phone' })
  readonly phone: string;
  @ApiProperty({ example: 'YourLogin', description: 'User telegram login' })
  readonly telegram: string;
  @ApiProperty({
    example: '380984561225',
    description: 'User whatsapp phone number',
  })
  readonly whatsapp: string;
  @ApiProperty({ example: 'Kyiv', description: 'User location' })
  readonly location: string;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
    description: 'User master photo',
  })
  readonly master_photo: Photo;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'User master photo',
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
    description: 'Category and subcategory',
  })
  readonly category: Categories[];
  @ApiProperty({
    example: 'https://www.instagram.com/herlastsightband/',
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
  readonly verify: verify;
  @ApiProperty({ example: 'false', description: 'User ban status' })
  readonly ban: boolean;
}

export interface search_result {
  totalPages: number;
  currentPage: number;
  data: UpdateUserDto[];
}
