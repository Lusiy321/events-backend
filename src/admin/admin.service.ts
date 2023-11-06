/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { compareSync, hashSync } from 'bcrypt';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { CreateAdminDto } from './dto/create.admin.dto';
import { Admin, AdminSchema } from './admin.model';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { User } from 'src/users/users.model';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Admin,
    @InjectModel(User.name)
    private userModel: User,
  ) {}

  async createAdmin(admin: CreateAdminDto, req: any): Promise<Admin> {
    try {
      const findSuper = await this.findToken(req);
      if (!findSuper) {
        throw new Unauthorized('jwt expired');
      }
      if (findSuper.role === 'superadmin') {
        const { username } = admin;
        const lowerCase = username.toLowerCase();

        const registration = await this.adminModel.findOne({
          username: lowerCase,
        });
        if (registration) {
          throw new Conflict(`Admin with ${username} in use`);
        }

        const created = await this.adminModel.create(admin);
        created.setPassword(admin.password);
        created.save();

        return await this.adminModel.findById(created._id);
      } else {
        throw new BadRequest('You are not superadmin');
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async login(user: CreateAdminDto): Promise<Admin> {
    try {
      const { username, password } = user;
      const lowerCase = username.toLowerCase();
      const authUser = await this.adminModel.findOne({
        username: lowerCase,
      });
      if (!authUser || !authUser.comparePassword(password)) {
        throw new Unauthorized(`Username or password is wrong`);
      }
      await this.createToken(authUser);
      return await this.adminModel.findOne({ username: lowerCase });
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async logout(req: any): Promise<Admin> {
    const admin = await this.findToken(req);
    if (!admin) {
      throw new Unauthorized('jwt expired');
    }
    try {
      await this.adminModel.findByIdAndUpdate(
        { _id: admin.id },
        { token: null },
      );
      return await this.adminModel.findById({ _id: admin.id });
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async findAllAdmins(req: any): Promise<Admin[]> {
    try {
      const findSuper = await this.findToken(req);
      if (!findSuper) {
        throw new Unauthorized('jwt expired');
      }
      if (findSuper.role === 'superadmin' || findSuper.role === 'admin') {
        const find = await this.adminModel.find().exec();
        return find;
      } else {
        throw new BadRequest('You are not admin');
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findByIdUpdate(
    id: string,
    user: UpdateUserDto,
    req: any,
  ): Promise<User> {
    const { ...params } = user;
    try {
      const findSuper = await this.findToken(req);
      if (!findSuper) {
        throw new Unauthorized('jwt expired');
      }
      if (findSuper.role === 'moderator' || findSuper.role === 'admin') {
        if (params) {
          await this.userModel.findByIdAndUpdate(
            { _id: id },
            {
              ...params,
            },
          );
          const userUpdate = this.userModel.findById({ _id: id });
          return userUpdate;
        } else {
          throw new BadRequest('You are not admin');
        }
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  // JWT TOKEN
  async findToken(req: any): Promise<Admin> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.adminModel.findById({ _id: findId.id });

      return user;
    } catch (e) {
      throw new Unauthorized('jwt expired');
    }
  }

  async createToken(authUser: { _id: string }) {
    const payload = {
      id: authUser._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = sign(payload, SECRET_KEY, { expiresIn: '10m' });
    await this.adminModel.findByIdAndUpdate(authUser._id, { token });
    const authentificationUser = await this.adminModel.findById({
      _id: authUser._id,
    });
    return authentificationUser;
  }

  async refreshAccessToken(req: any): Promise<Admin> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const user = await this.adminModel.findOne({ token: token });
      if (!user) {
        throw new NotFound('User not found');
      }
      const payload = {
        id: user._id,
      };
      const tokenRef = sign(payload, SECRET_KEY, { expiresIn: '24h' });
      await this.adminModel.findByIdAndUpdate(user._id, { token: tokenRef });
      const authentificationUser = await this.adminModel.findById({
        _id: user.id,
      });
      return authentificationUser;
    } catch (error) {
      throw new BadRequest('Invalid refresh token');
    }
  }
}

AdminSchema.methods.setPassword = async function (password: string) {
  return (this.password = hashSync(password, 10));
};

AdminSchema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};
