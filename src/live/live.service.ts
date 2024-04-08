import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.model';
import { CreateLiveDto, SearchLive, search_live } from './dto/create.live.dto';
import { Live } from './live.model';
import {
  Conflict,
  NotFound,
  BadRequest,
  Unauthorized,
  NotAcceptable,
} from 'http-errors';
import { verify, JwtPayload } from 'jsonwebtoken';
import { CloudinaryService } from 'src/users/cloudinary.service';

@Injectable()
export class LiveService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Live.name)
    private liveModel: Live,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAllUsersMessage(query: SearchLive): Promise<search_live> {
    const { page, limit } = query;
    const curentPage = page || 1;
    const curentlimit = limit || 8;
    try {
      const totalCount = await this.liveModel.countDocuments();
      const totalPages = Math.ceil(totalCount / curentlimit);
      const offset = (curentPage - 1) * curentlimit;
      const find = await this.liveModel
        .find()
        .limit(curentlimit)
        .skip(offset)
        .exec();
      return {
        totalPages: totalPages,
        currentPage: curentPage,
        data: find,
      };
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async createMessage(
    req: any,
    content: CreateLiveDto,
    file: any,
  ): Promise<Live> {
    try {
      const user = await this.findToken(req);
      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      if (file) {
        const imgUrl = await this.cloudinaryService.uploadImageLive(user, file);
        const createdLive = await this.liveModel.create({
          ...content,
          avatar: user.avatar.url,
          author: user._id,
          image: imgUrl,
        });
        createdLive.save();
        return await this.liveModel.findById(createdLive._id).exec();
      } else {
        const createdLive = await this.liveModel.create({
          ...content,
          avatar: user.avatar.url,
          author: user._id,
        });
        createdLive.save();
        return await this.liveModel.findById(createdLive._id).exec();
      }
    } catch (e) {
      throw e;
    }
  }

  async findToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');
      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      } else {
        const SECRET_KEY = process.env.SECRET_KEY;
        const findId = verify(token, SECRET_KEY) as JwtPayload;
        const user = await this.userModel.findById({ _id: findId.id }).exec();
        return user;
      }
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new Unauthorized('jwt expired');
      } else {
        throw e;
      }
    }
  }

  async addLike(req: any, postId: string) {
    try {
      const user = await this.findToken(req);
      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      const post = await this.liveModel.findById(postId);
      if (!post) {
        throw new NotFound('Post not found');
      }
      const userIndex = post.like.indexOf(user._id);
      if (userIndex !== -1) {
        post.like.splice(userIndex, 1);
        post.save();
        return post;
      } else {
        post.like.push(user._id);
        post.save();
        return post;
      }
    } catch (e) {
      throw e;
    }
  }

  async addDislike(req: any, postId: string) {
    try {
      const user = await this.findToken(req);
      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      const post = await this.liveModel.findById(postId);
      if (!post) {
        throw new NotFound('Post not found');
      }
      const userIndex = post.dislikes.indexOf(user._id);
      if (userIndex !== -1) {
        post.dislikes.splice(userIndex, 1);
        post.save();
        return post;
      } else {
        post.dislikes.push(user._id);
        post.save();
        return post;
      }
    } catch (e) {
      throw e;
    }
  }

  async deletePost(req: any, postId: string) {
    try {
      const user = await this.findToken(req);
      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      const post = await this.liveModel.findById(postId);
      if (!post) {
        throw new NotFound('Post not found');
      }
      if (post.author === user._id) {
        return await this.liveModel.findByIdAndRemove(postId);
      } else {
        throw new NotAcceptable('You are not the author of this post');
      }
    } catch (e) {
      throw e;
    }
  }
}
