/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ versionKey: false, timestamps: true })
export class Banner extends Model<Banner> {
  @ApiProperty({ example: 'title of banner', description: 'Banner title' })
  @Prop({
    type: String,
  })
  title: string;
  @ApiProperty({ example: 'https://', description: 'Banner img' })
  @Prop({
    type: String,
  })
  img: string;

  @ApiProperty({ example: 'Some text of banner', description: 'Banner text' })
  @Prop({
    type: String,
  })
  description: string;

  @ApiProperty({ example: 'Link to user or site', description: 'Banner URL' })
  @Prop({
    type: String,
  })
  link: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
