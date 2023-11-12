import { Injectable } from '@nestjs/common';
import { Posts } from './posts.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreatePostDto } from './dto/create.posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name)
    private postsModel: Posts,
  ) {}
  async findAllPosts(): Promise<Posts[]> {
    try {
      const find = await this.postsModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('Posts not found');
    }
  }

  async findById(id: string): Promise<Posts> {
    try {
      const find = await this.postsModel.findById(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('Posts not found');
    }
  }

  async create(posts: CreatePostDto): Promise<Posts> {
    try {
      const createPosts = await this.postsModel.create(posts);
      createPosts.save();
      return await this.postsModel.findById(createPosts._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async postUpdate(id: string, posts: CreatePostDto): Promise<Posts> {
    const { ...params } = posts;
    const post = await this.postsModel.findById({ _id: id });
    try {
      if (post) {
        await this.postsModel.findByIdAndUpdate(
          { _id: id },
          {
            ...params,
          },
        );

        return await this.postsModel.findById({ _id: id });
      } else {
        throw new BadRequest('Post not found');
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async postDelete(id: string): Promise<Posts> {
    try {
      const find = await this.postsModel.findByIdAndRemove(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('Posts not found');
    }
  }
}
