/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

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

  @ApiProperty({ example: 'Link to user or site', description: 'Banner URL' })
  @Prop({
    type: String,
  })
  url: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
