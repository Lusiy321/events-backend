import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Categories } from 'src/users/dto/caterory.interface';

export type OrdersDocument = Orders & Document;

@Schema({ versionKey: false, timestamps: true })
export class Orders extends Model<Orders> {
  @ApiProperty({ example: '380987894556', description: 'User phone number' })
  @Prop({
    type: String,
    minlength: 13,
    maxlength: 13,
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
    description: 'Order category',
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
}

export const OrderSchema = SchemaFactory.createForClass(Orders);
