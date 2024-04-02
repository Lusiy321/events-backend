import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.model';
import { CreateLiveDto } from './dto/create.live.dto';
import { Live } from './live.model';
import {
  Conflict,
  NotFound,
  BadRequest,
  Unauthorized,
  NotAcceptable,
} from 'http-errors';
import { verify, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class LiveService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Live.name)
    private liveModel: Live,
  ) {}

  async findAllUsers(): Promise<Live[]> {
    try {
      const find = await this.liveModel.find();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async create(req: any, content: CreateLiveDto): Promise<Live> {
    try {
      const user = await this.findToken(req);
      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      const createdLive = await this.liveModel.create({
        ...content,
        avatar: user.avatar.url,
        author: user._id,
      });
      createdLive.save();
      return await this.liveModel.findById(createdLive._id).exec();
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
}
