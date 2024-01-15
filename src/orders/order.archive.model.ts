import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Categories } from 'src/users/dto/caterory.interface';

export type OrdersDocument = OrdersArchive & Document;

@Schema({ versionKey: false, timestamps: true })
export class OrdersArchive extends Model<OrdersArchive> {
  @ApiProperty({ example: '380987894556', description: 'User phone number' })
  @Prop({
    type: String,
    minlength: 12,
    maxlength: 12,
    required: [true, 'User phone number'],
  })
  phone: string;

  @ApiProperty({
    example: 'Ivan Petrov',
    description: 'Your name',
  })
  @Prop({
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'I whand music band on 20:00 today',
    description: 'Order description',
  })
  @Prop({
    type: String,
  })
  description: string;

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
    description: 'Order description',
  })
  @Prop({
    type: Array<Object>,
    default: [],
  })
  category: Array<Categories>;

  @ApiProperty({
    example: 'YourLogin',
    description: 'Order telegram login',
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

  @Prop({
    type: String,
    default: 'none',
  })
  botLink: string;

  @Prop({
    type: String,
    default: 'none',
  })
  exactLocation: string;

  @Prop({
    type: String,
    default: null,
  })
  viber: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'User location',
  })
  @Prop({
    type: String,
  })
  location: string;

  @ApiProperty({
    example: '100$',
    description: 'User price',
  })
  @Prop({
    type: String,
    default: 'За домовленістю',
  })
  price: string;

  @ApiProperty({
    example: '10.11.2024',
    description: 'Order data',
    default: 'Не визначено',
  })
  @Prop({ type: String })
  date: string;

  @ApiProperty({ example: 'true', description: 'Order status' })
  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;

  @ApiProperty({ example: '123564', description: 'SMS code' })
  @Prop({
    type: Number,
  })
  sms: number;
  @ApiProperty({ example: 'true', description: 'Order verify' })
  @Prop({
    type: Boolean,
    default: false,
  })
  verify: boolean;

  @ApiProperty({ example: '123564', description: 'SMS code' })
  @Prop({
    type: Number,
    default: 0,
  })
  approve_count: number;
  @Prop({ type: Array, default: [] })
  accepted_users: Array<string>;
}

export const OrdersArchiveSchema = SchemaFactory.createForClass(OrdersArchive);
