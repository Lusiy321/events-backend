import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'mongoose';

export type PostsDocument = Posts & Document;

@Schema({ versionKey: false, timestamps: true })
export class Posts extends Model<Posts> {
  @ApiProperty({
    example: 'It is a new post of more interesting information',
    description: 'Post title',
  })
  @Prop({
    type: String,
  })
  title: string;

  @ApiProperty({
    example: 'I whand music band on my restoran',
    description: 'Post description',
  })
  @Prop({
    type: String,
  })
  description: string;

  @ApiProperty({
    example: [
      { publicId: '1', url: 'https://' },
      { publicId: '2', url: 'https://' },
    ],
    description: 'Post images',
  })
  @Prop({
    type: Array<Object>,
    default: [],
  })
  img: Array<string>;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
