/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Categories } from './dto/caterory.interface';
import { verify } from './dto/verify.user.dto';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User extends Model<User> {
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    required: [true, 'User name is required'],
  })
  firstName: string;

  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  @Prop({ type: String, required: [true, 'Email is required'] })
  email: string;

  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  @Prop({
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
  })
  password: string;

  @ApiProperty({ example: 'My music work', description: 'User post title' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 30,
  })
  title: string;

  @ApiProperty({ example: 'I sing song', description: 'User post description' })
  @Prop({
    type: String,
  })
  description: string;

  @ApiProperty({
    example: '+380987894556',
    description: 'User phone number',
  })
  @Prop({
    type: String,
    minlength: 10,
    maxlength: 13,
    required: [true, 'Phone is required'],
  })
  phone: string;

  @ApiProperty({
    example: '@YourLogin',
    description: 'User telegram login',
  })
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 15,
  })
  telegram: string;

  @Prop({
    type: Number,
    default: null,
  })
  tg_chat: number;

  @ApiProperty({
    example: '+380987894556',
    description: 'User viber phone number',
  })
  @Prop({
    type: String,
  })
  viber: string;

  @Prop({
    type: String,
    default: null,
  })
  viber_chat: string;

  @ApiProperty({
    example: '+380987894556',
    description: 'User whatsapp phone number',
  })
  @Prop({
    type: String,
    minlength: 10,
    maxlength: 13,
  })
  whatsapp: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'User location',
  })
  @Prop({
    type: String,
    default: 'Місто не обрано',
  })
  location: string;

  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
    description: 'User master photo',
  })
  @Prop({
    type: Object,
    default: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
  })
  master_photo: Photo;

  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'User master photo',
  })
  @Prop({
    type: Object,
    default: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
  })
  avatar: Photo;

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
  @Prop({
    type: Array<Object>,
    default: [],
  })
  photo: Photo[];

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
    description: 'User video',
  })
  @Prop({
    type: Array<Object>,
    default: [],
  })
  video: Photo[];

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
          {
            name: 'Ді-джеї та звукорежисери',
            id: '4bb29caa-f936-45df-baeb-6ca488404f55',
          },
          {
            name: 'Кавер-групи',
            id: '5843bd7-1d85-48e1-b225-56ff78e34514',
          },
          {
            name: 'Сольні виконавці',
            id: '5f24f679-54a1-4449-b03c-95fe36afb56c',
          },
        ],
      },
    ],
    description: 'User category',
  })
  @Prop({
    type: Array<Object>,
    default: [],
  })
  category: Categories[];

  @ApiProperty({ example: 'true', description: 'User status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  isOnline: boolean;

  @ApiProperty({ example: 'true', description: 'User paid' })
  @Prop({
    type: Boolean,
    default: false,
  })
  paid: boolean;

  @ApiProperty({ example: 'true', description: 'User trial period' })
  @Prop({
    type: Boolean,
    default: false,
  })
  trial: boolean;

  @ApiProperty({
    example: '100$',
    description: 'User price',
  })
  @Prop({ type: String })
  price: string;

  @ApiProperty({
    example: '{Instagram: https://www.instagram.com/herlastsightband/}',
    description: 'User social links',
  })
  @Prop({
    type: Object,
    default: { Instagram: 'https://' },
  })
  social: Social;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'JWT token',
  })
  @Prop({ type: String, default: null })
  token: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'JWT token',
  })
  @Prop({ type: String, default: null })
  refresh_token: string;

  @ApiProperty({ example: 'new', description: 'User moderate status' })
  @Prop({
    type: String,
    default: 'new',
  })
  verified: string;
  @ApiProperty({ example: false, description: 'User email verify' })
  @Prop({
    type: Boolean,
    default: false,
  })
  verify: boolean;
  @ApiProperty({
    example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'Google ID',
  })
  @Prop({ type: String })
  googleId: string;

  @ApiProperty({
    example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'facebook ID',
  })
  @Prop({ type: String })
  facebookId: string;

  @Prop({
    type: String,
    default: process.env.MASTER,
  })
  metaUrl: string;

  @ApiProperty({ example: 'false', description: 'User ban status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  ban: boolean;
  @Prop({
    type: Number,
    default: 0,
  })
  totalRating: number;
  @Prop({
    type: Number,
    default: 0,
  })
  numberOfRatings: number;
  @Prop({
    type: Number,
    default: 0,
  })
  agree_order: number;
  @Prop({
    type: Number,
    default: 0,
  })
  disagree_order: number;
  @Prop({
    type: Date,
  })
  trialEnds: Date;
  @Prop({
    type: Date,
    default: new Date(),
  })
  paidEnds: Date;

  @Prop({ type: Array, default: [] })
  accepted_orders: Array<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface Photo {
  publicId: string;
  url: string;
}

export interface Social {
  Instagram?: string;
  Facebook?: string;
  Youtube?: string;
  TikTok?: string;
  Vimeo?: string;
  SoundCloud?: string;
  Spotify?: string;
  AppleMusic?: string;
  Deezer?: string;
  WebSite?: string;
}
