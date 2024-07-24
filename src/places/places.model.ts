/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Photo, Social, Categories } from '../users/utils/user.types';

export type PlaceDocument = Place & Document;

@Schema({ versionKey: false, timestamps: true })
export class Place extends Model<Place> {
  @ApiProperty({ example: 'Cafe Astoria', description: 'Place name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    required: [true, 'Place name is required'],
  })
  placeName: string;

  @ApiProperty({ example: 'astoria@gmail.com', description: 'email' })
  @Prop({ type: String, required: [true, 'Email is required'] })
  email: string;

  @ApiProperty({ example: 'Cafeastoria-123545', description: 'password' })
  @Prop({
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
  })
  password: string;

  @ApiProperty({
    example: 'My restoran Astoria',
    description: 'Place post title',
  })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 30,
  })
  title: string;

  @ApiProperty({
    example: 'We are good coock',
    description: 'Place post description',
  })
  @Prop({
    type: String,
  })
  description: string;

  @ApiProperty({
    example: '+380987894556',
    description: 'Administrator place phone number',
  })
  @Prop({
    type: String,
    minlength: 10,
    maxlength: 13,
  })
  phone: string;

  @ApiProperty({
    example: '@YourLogin',
    description: 'Place telegram login',
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
    description: 'Place viber phone number',
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
    description: 'Place whatsapp phone number',
  })
  @Prop({
    type: String,
    minlength: 10,
    maxlength: 13,
  })
  whatsapp: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'Place location',
  })
  @Prop({
    type: String,
    default: 'Місто не обрано',
  })
  location: string;

  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1717082688/service/b1ojvtvqnvrlllh35yb5.jpg',
    },
    description: 'Place master photo',
  })
  @Prop({
    type: Photo,
    default: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1717082688/service/b1ojvtvqnvrlllh35yb5.jpg',
    },
  })
  master_photo: Photo;

  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'Place master photo',
  })
  @Prop({
    type: Photo,
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
    description: 'Place photo',
  })
  @Prop({
    type: [Photo],
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
    type: [Photo],
    default: [],
  })
  video: Photo[];

  @ApiProperty({
    example: [
      {
        _id: '65258a576f9a7d99e555c7bd',
        name: 'Ресторанні послуги',
        subcategories: [
          {
            name: 'Банкетні зали',
            id: '872c7525-ef5b-4dc3-9082-bdb98426fb1a',
          },
        ],
      },
    ],
    description: 'Place category',
  })
  @Prop({
    type: [Categories],
    default: [],
  })
  category: Categories[];

  @ApiProperty({ example: 'true', description: 'Place status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  isOnline: boolean;

  @ApiProperty({ example: 'true', description: 'Place paid' })
  @Prop({
    type: Boolean,
    default: false,
  })
  paid: boolean;

  @ApiProperty({ example: 'true', description: 'Place trial period' })
  @Prop({
    type: Boolean,
    default: false,
  })
  trial: boolean;

  @ApiProperty({
    example: '100$',
    description: 'Place price',
  })
  @Prop({ type: String })
  price: string;

  @ApiProperty({
    example: '{Instagram: https://www.instagram.com/herlastsightband/}',
    description: 'Place social links',
  })
  @Prop({
    type: Object,
    default: null,
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

  @Prop({
    type: Boolean,
    default: false,
  })
  register: boolean;

  @Prop({ type: Array, default: [] })
  accepted_orders: Array<string>;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
