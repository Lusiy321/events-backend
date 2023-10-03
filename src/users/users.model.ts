/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User extends Model<User> {
  @ApiProperty({ example: 'Volodymyr', description: 'User first name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  firstName: string;

  @ApiProperty({ example: 'Zelenskiy', description: 'User last name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  lastName: string;

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
    minlength: 2,
    maxlength: 400,
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
    default: '+380000000000',
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

  @ApiProperty({
    example: '+380987894556',
    description: 'User viber phone number',
  })
  @Prop({
    type: String,
    minlength: 10,
    maxlength: 13,
  })
  viber: string;

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
    minlength: 2,
    maxlength: 20,
    default: 'Kyiv',
  })
  location: string;

  @ApiProperty({
    example: 'https://',
    description: 'User avatarURL',
  })
  @Prop({
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  })
  master_photo: string;

  @ApiProperty({
    example: [
      { id: '1', url: 'https://' },
      { id: '2', url: 'https://' },
    ],
    description: 'User photo',
  })
  @Prop({
    type: Array<Object>,
    default: [],
  })
  photo: Array<string>;

  @ApiProperty({
    example: ['https://', 'https://'],
    description: 'User video',
  })
  @Prop({
    type: Array<String>,
    default: [],
  })
  video: Array<string>;

  @ApiProperty({
    example: ['music', 'show'],
    description: 'User categoty',
  })
  @Prop({
    type: Array<String>,
    default: [],
  })
  categoty: Array<string>;

  @ApiProperty({
    example: ['rock', 'pop'],
    description: 'User category genre',
  })
  @Prop({
    type: Array<String>,
    default: [],
  })
  genre: Array<string>;

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
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
    description: 'JWT token',
  })
  @Prop({ type: String, default: null })
  token: string;

  @ApiProperty({ example: 'true', description: 'User status' })
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

  @ApiProperty({ example: 'false', description: 'User ban status' })
  @Prop({
    type: Boolean,
    default: false,
  })
  ban: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
