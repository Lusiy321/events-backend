import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Subcategories } from './utils/user.types';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false, timestamps: true })
export class Category extends Model<Category> {
  @ApiProperty({ example: 'Музичні послуги', description: 'Category name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Category name is required'],
  })
  name: string;

  @ApiProperty({
    example: [
      { id: 101, name: 'Rock' },
      { id: 102, name: 'Jazz' },
    ],
    description: 'Subcategories',
    default: [],
  })
  @Prop({
    type: Array<Subcategories>,
    default: [],
  })
  subcategories: Array<Subcategories>;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
