/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type LiveDocument = Live & Document;

@ObjectType('Live')
@Schema({ versionKey: false, timestamps: false })
export class Live extends Model<Live> {
  @Field(() => ID)
  _id: string;

  @ApiProperty({ example: 'User ID', description: 'author of text' })
  @Prop({
    type: String,
  })
  @Field()
  author: string;

  @ApiProperty({ example: 'https://', description: 'User avatar img' })
  @Prop({
    type: String,
  })
  @Field()
  avatar: string;

  @ApiProperty({ example: 'Some text', description: 'Users text of post' })
  @Prop({
    type: String,
  })
  @Field()
  content: string;

  @ApiProperty({ example: 'https://', description: 'Img URL' })
  @Prop({
    type: String,
    default: null,
  })
  @Field()
  image: string;

  @ApiProperty({ example: '03.03.2025', description: 'Date of create' })
  @Prop({
    type: Date,
    default: new Date(),
  })
  @Field()
  date: Date;

  @Prop({
    type: Array,
    default: [],
  })
  @Field(() => [String])
  like: Array<string>;

  @Prop({
    type: Array,
    default: [],
  })
  @Field(() => [String])
  dislikes: Array<string>;
}

export const LiveSchema = SchemaFactory.createForClass(Live);
