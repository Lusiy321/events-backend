import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Posts } from './posts.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
    ]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
