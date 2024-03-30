/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Photo, Social, Categories } from './utils/user.types';

export type UserDocument = User & Document;
@ObjectType('User')
@Schema({ versionKey: false, timestamps: true })
export class User extends Model<User> {
  @Field(() => ID)
  _id: string;
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    required: [true, 'User name is required'],
  })
  @Field()
  firstName: string;

  @ApiProperty({ example: 'zelenskiy@gmail.com', description: 'User email' })
  @Prop({ type: String, required: [true, 'Email is required'] })
  @Field()
  email: string;

  @ApiProperty({ example: 'Vovan-123545', description: 'User password' })
  @Prop({
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
  })
  @Field()
  password: string;

  @ApiProperty({ example: 'My music work', description: 'User post title' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 30,
  })
  @Field()
  title: string;

  @ApiProperty({ example: 'I sing song', description: 'User post description' })
  @Prop({
    type: String,
  })
  @Field()
  description: string;

  @ApiProperty({
    example: '+380987894556',
    description: 'User phone number',
  })
  @Prop({
    type: String,
    minlength: 10,
    maxlength: 13,
  })
  @Field()
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
  @Field()
  telegram: string;

  @Prop({
    type: Number,
    default: null,
  })
  @Field()
  tg_chat: number;

  @ApiProperty({
    example: '+380987894556',
    description: 'User viber phone number',
  })
  @Prop({
    type: String,
  })
  @Field()
  viber: string;

  @Prop({
    type: String,
    default: null,
  })
  @Field()
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
  @Field()
  whatsapp: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'User location',
  })
  @Prop({
    type: String,
    default: 'Місто не обрано',
  })
  @Field()
  location: string;

  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
    description: 'User master photo',
  })
  @Prop({
    type: Photo,
    default: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
    },
  })
  @Field()
  master_photo: Photo;

  @ApiProperty({
    example: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
    description: 'User master photo',
  })
  @Prop({
    type: Photo,
    default: {
      publicId: '1',
      url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
    },
  })
  @Field()
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
    type: [Photo],
    default: [],
  })
  @Field(() => [Photo])
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
  @Field(() => [Photo])
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
    type: [Categories],
    default: [],
  })
  @Field(() => [Categories])
  category: Categories[];

  @ApiProperty({ example: 'true', description: 'User status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  @Field()
  isOnline: boolean;

  @ApiProperty({ example: 'true', description: 'User paid' })
  @Prop({
    type: Boolean,
    default: false,
  })
  @Field()
  paid: boolean;

  @ApiProperty({ example: 'true', description: 'User trial period' })
  @Prop({
    type: Boolean,
    default: false,
  })
  @Field()
  trial: boolean;

  @ApiProperty({
    example: '100$',
    description: 'User price',
  })
  @Prop({ type: String })
  @Field()
  price: string;

  @ApiProperty({
    example: '{Instagram: https://www.instagram.com/herlastsightband/}',
    description: 'User social links',
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
  @Field()
  token: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'JWT token',
  })
  @Prop({ type: String, default: null })
  @Field()
  refresh_token: string;

  @ApiProperty({ example: 'new', description: 'User moderate status' })
  @Prop({
    type: String,
    default: 'new',
  })
  @Field()
  verified: string;

  @ApiProperty({ example: false, description: 'User email verify' })
  @Prop({
    type: Boolean,
    default: false,
  })
  @Field()
  verify: boolean;

  @ApiProperty({
    example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'Google ID',
  })
  @Prop({ type: String })
  @Field()
  googleId: string;

  @ApiProperty({
    example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'facebook ID',
  })
  @Prop({ type: String })
  @Field()
  facebookId: string;

  @Prop({
    type: String,
    default: process.env.MASTER,
  })
  @Field()
  metaUrl: string;

  @ApiProperty({ example: 'false', description: 'User ban status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  @Field()
  ban: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  @Field()
  totalRating: number;

  @Prop({
    type: Number,
    default: 0,
  })
  @Field()
  numberOfRatings: number;

  @Prop({
    type: Number,
    default: 0,
  })
  @Field()
  agree_order: number;

  @Prop({
    type: Number,
    default: 0,
  })
  @Field()
  disagree_order: number;

  @Prop({
    type: Date,
  })
  trialEnds: Date;
  @Prop({
    type: Date,
    default: new Date(),
  })
  @Field()
  paidEnds: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  @Field()
  register: boolean;

  @Prop({ type: Array, default: [] })
  accepted_orders: Array<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
