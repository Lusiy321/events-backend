/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { place } from './dto/position.banner';

export type BannerDocument = Banner & Document;

@Schema({ versionKey: false, timestamps: true })
export class Banner extends Model<Banner> {
  @ApiProperty({ example: 'https://', description: 'Banner img' })
  @Prop({
    type: String,
  })
  img: string;

  @ApiProperty({ example: 'Some text of banner', description: 'Banner text' })
  @Prop({
    type: String,
  })
  text: string;

  @ApiProperty({ example: 'top', description: 'Banner position' })
  @Prop({
    type: String,
    enum: ['left', 'right', 'top'],
    default: 'new',
  })
  position: place;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
