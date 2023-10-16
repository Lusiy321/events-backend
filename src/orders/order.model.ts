import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false, timestamps: true })
export class Category extends Model<Category> {
  @ApiProperty({ example: 'music', description: 'Category name' })
  @Prop({
    type: String,
    minlength: 2,
    maxlength: 20,
    required: [true, 'Category name is required'],
  })
  phone: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
