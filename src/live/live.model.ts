/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type LiveDocument = Live & Document;

@Schema({ versionKey: false, timestamps: false })
export class Live extends Model<Live> {
  @ApiProperty({ example: 'User ID', description: 'author of text' })
  @Prop({
    type: String,
  })
  author: string;
  @ApiProperty({ example: 'https://', description: 'User avatar img' })
  @Prop({
    type: String,
  })
  avatar: string;

  @ApiProperty({ example: 'Some text', description: 'Users text of post' })
  @Prop({
    type: String,
  })
  content: string;

  @ApiProperty({ example: 'https://', description: 'Img URL' })
  @Prop({
    type: String,
    default: null,
  })
  image: string;
  @ApiProperty({ example: 'go', description: 'Button Name' })
  @Prop({
    type: Date,
    default: new Date(),
  })
  date: Date;
  @ApiProperty({ example: 'some user ID', description: 'user IDs' })
  @Prop({
    type: String,
    default: [],
  })
  like: Array<string>;
  @ApiProperty({ example: 'some user ID', description: 'user IDs' })
  @Prop({
    type: String,
    default: [],
  })
  dislikes: Array<string>;
}

export const LiveSchema = SchemaFactory.createForClass(Live);
