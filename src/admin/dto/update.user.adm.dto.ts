/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { verify } from 'src/users/dto/verify.user.dto';

export class UpdateUserAdmDto {
  @ApiProperty({ example: 'fksldflk88789dksfjl', description: 'User ID' })
  id: string;
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  readonly firstName: string;
  @ApiProperty({ example: 'Zelenskiy', description: 'User last name' })
  readonly lastName: string;
  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  readonly password: string;
  @ApiProperty({ example: 'My music work', description: 'User post title' })
  readonly title: string;
  @ApiProperty({ example: 'I sing song', description: 'User post description' })
  readonly description: string;
  @ApiProperty({ example: '+380984561225', description: 'User phone' })
  readonly phone: string;
  @ApiProperty({ example: '@YourLogin', description: 'User telegram login' })
  readonly telegram: string;
  @ApiProperty({ example: '+380984561225', description: 'User viber phone' })
  readonly viber: string;
  @ApiProperty({
    example: '+380984561225',
    description: 'User whatsapp phone number',
  })
  readonly whatsapp: string;
  @ApiProperty({ example: 'Kyiv', description: 'User location' })
  readonly location: string;
  @ApiProperty({ example: 'https://', description: 'User photo' })
  readonly master_photo: string;
  @ApiProperty({
    example: [{ id: '1', url: 'https://' }],
    description: 'User photo collection',
  })
  readonly photo: Array<object>;
  @ApiProperty({ example: ['https://'], description: 'User photo collection' })
  readonly video: Array<string>;
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
  readonly category: Array<string>;
  @ApiProperty({ example: '100$', description: 'Price' })
  readonly price: string;

  @ApiProperty({ example: 'true', description: 'User paid' })
  readonly paid: boolean;

  @ApiProperty({ example: 'true', description: 'User status' })
  readonly isOnline: boolean;

  @ApiProperty({ example: 'true', description: 'User trial period' })
  readonly trial: boolean;

  @ApiProperty({
    example: ['new', 'approve', 'rejected'],
    description: 'User moderate status',
  })
  readonly verify: verify;

  @ApiProperty({ example: 'false', description: 'User ban status' })
  readonly ban: boolean;
}
