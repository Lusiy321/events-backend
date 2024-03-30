/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Photo, Social } from '../utils/user.types';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../users.model';

@InputType('UpdateUser')
export class UpdateUserDto {
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  @Field()
  readonly firstName: string;
  @ApiProperty({ example: 'My music work', description: 'User post title' })
  @Field()
  readonly title: string;
  @ApiProperty({ example: 'I sing song', description: 'User post description' })
  @Field()
  readonly description: string;
  @ApiProperty({ example: '380984561225', description: 'User phone' })
  @Field()
  readonly phone: string;
  @ApiProperty({ example: 'YourLogin', description: 'User telegram login' })
  @Field()
  readonly telegram: string;
  @ApiProperty({ example: 'YourLogin', description: 'User viber login' })
  @Field()
  readonly viber: string;
  @ApiProperty({
    example: '380984561225',
    description: 'User whatsapp phone number',
  })
  @Field()
  readonly whatsapp: string;
  @ApiProperty({ example: 'Kyiv', description: 'User location' })
  @Field()
  readonly location: string;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
    description: 'User master photo',
  })
  @Field(() => Photo)
  readonly master_photo: Photo;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'User master photo',
  })
  @Field(() => Photo)
  readonly avatar: Photo;
  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://',
    },
    description: 'User video',
  })
  @Field(() => [Photo])
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
  @Field(() => [Photo])
  readonly photo: Photo[];
  @ApiProperty({
    example: { Facebook: 'https://www.facebook.com/psmirnyj/' },
    description: 'User social links',
  })
  @Field()
  readonly social: Social;
  @ApiProperty({ example: 'true', description: 'User status' })
  @Field()
  readonly isOnline: boolean;
  @ApiProperty({ example: '100$', description: 'Price' })
  @Field()
  readonly price: string;
  @ApiProperty({ example: 'true', description: 'User paid' })
  @Field()
  readonly paid: boolean;
  @ApiProperty({ example: 'true', description: 'User trial period' })
  @Field()
  readonly trial: boolean;
  @ApiProperty({ example: 'new', description: 'User moderate status' })
  @Field()
  readonly verify: string;
  @ApiProperty({ example: 'false', description: 'User ban status' })
  @Field()
  readonly ban: boolean;
  @ApiProperty({ example: 'false', description: 'User register status' })
  @Field()
  readonly register: boolean;
}

@ObjectType('search_result')
export class search_result {
  @Field()
  totalPages: number;
  @Field()
  currentPage: number;
  @Field(() => [User])
  data: User[];
}
