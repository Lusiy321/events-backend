import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Subcategories } from '../users/utils/user.types';

export type CategoryPlaceDocument = CategoryPlace & Document;

@Schema({ versionKey: false, timestamps: true })
export class CategoryPlace extends Model<CategoryPlace> {
  @ApiProperty({ example: 'Ресторани', description: 'Category name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Category name is required'],
  })
  name: string;

  @ApiProperty({
    example: [
      { id: 101, name: 'Бари' },
      { id: 102, name: 'Кафе' },
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

export const CategoryPlaceSchema = SchemaFactory.createForClass(CategoryPlace);
