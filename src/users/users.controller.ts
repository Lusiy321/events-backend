/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { BadRequest } from 'http-errors';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { GoogleAuthGuard } from './utils/Guards';
import { PasswordChangeDto } from './dto/change-password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { Category } from './category.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { DelUserMediaDto } from './dto/delete.user.dto';
import { FacebookAuthGuard } from './utils/GuardFacebook';
import { SearchService } from './search.service';
import { PasswordUserDto } from './dto/password.user.dto';
import { Categories } from './utils/user.types';
import { LoginUserDto } from './dto/login.user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly searchService: SearchService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  [x: string]: any;

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, type: User })
  @Post('/')
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @ApiOperation({
    summary: 'Search posts from query ( ?req=музикант&loc=Київ )',
  })
  @ApiResponse({ status: 200, type: [User] })
  @Get('/')
  async searchUser(@Query() query: any): Promise<any> {
    return this.searchService.searchUsers(query);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: User })
  @Get('/find')
  async findUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: User })
  @Get('/find/:id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Get category' })
  @ApiResponse({ status: 200, type: Category })
  @Get('category')
  async findCat(): Promise<Category[]> {
    return this.usersService.findCategory();
  }

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(200)
  @Post('login')
  async login(@Body() user: LoginUserDto): Promise<User> {
    return await this.usersService.login(user);
  }

  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() request: any): Promise<User> {
    return this.usersService.logout(request);
  }

  @ApiOperation({ summary: 'First register user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/registration')
  async firstRegister(
    @Body() data: UpdateUserDto,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.firstRegisterUser(data, request);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/')
  async update(
    @Body() data: UpdateUserDto,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.updateUser(data, request);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/update-category')
  async updateCat(
    @Body() data: Categories,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.updateCategory(data, request);
  }

  @ApiOperation({ summary: 'Delet category' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('/category/:id')
  async delCat(@Param('id') id: string, @Req() request: any): Promise<User> {
    return this.usersService.deleteCategory(id, request);
  }

  @ApiOperation({ summary: 'Upload images' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now();
          const extension = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadPhoto(
    @Req() req: any,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<User> {
    try {
      const user = await this.usersService.findToken(req);
      if (!user) {
        throw new Error('User not found');
      }

      await this.cloudinaryService.uploadImages(user, images);
      return await this.usersService.findById(user.id);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  }

  @ApiOperation({ summary: 'Avatar image upload' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('avatar')
  @UseInterceptors(
    FilesInterceptor('file', 6, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now();
          const extension = path.parse(file.originalname).ext;
          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadUserAvatar(
    @Req() req: any,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<User> {
    const user = await this.usersService.findToken(req);
    await this.cloudinaryService.uploadAvatar(user, images);
    return await this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Delete user photo  (Body {id: kdsjfksdjfl})' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('photo')
  async deleteImage(
    @Body() id: DelUserMediaDto,
    @Req() req: any,
  ): Promise<User> {
    const user = await this.usersService.findToken(req);
    await this.cloudinaryService.deleteImage(user, id.id);
    return await this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Delete user video' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('video/:id')
  async deleteVideo(@Param('id') id: string, @Req() req: any): Promise<User> {
    return await this.usersService.deleteUserVideo(id, req);
  }

  @ApiOperation({ summary: 'Delete user avatar' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('avatar')
  async deleteAvatarImage(@Req() req: any): Promise<User> {
    const user = await this.usersService.findToken(req);
    await this.cloudinaryService.deleteAvatarImage(user);
    return await this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Login Google User' })
  @ApiResponse({ status: 200, type: GoogleUserDto })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return;
  }

  @ApiOperation({ summary: 'Google Authentication' })
  @ApiResponse({ status: 200, type: GoogleUserDto })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Res() res: any, @Req() req: any) {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return res.redirect(
      `${process.env.FRONT_LINK}?token=${user.refresh_token}`,
    );
  }

  @Get('facebook/login')
  @UseGuards(FacebookAuthGuard)
  facebookLogin() {
    return;
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Res() res: any, @Req() req: any) {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return res.redirect(
      `${process.env.FRONT_LINK}?token=${user.refresh_token}`,
    );
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('refresh')
  async refresh(@Req() req: any) {
    return await this.usersService.refreshAccessToken(req);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('change-password')
  async cangePwd(@Req() request: any, @Body() password: PasswordChangeDto) {
    return await this.usersService.changePassword(request, password);
  }

  @ApiOperation({ summary: 'Forgot password email send' })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPwd(@Body() email: MailUserDto) {
    await this.usersService.restorePassword(email);
    return { message: 'Email send' };
  }

  @ApiOperation({ summary: 'Delete user profile' })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('delete-profile')
  async deleteProfile(@Req() request: any, @Body() password: PasswordUserDto) {
    if (password.password === undefined) {
      throw new BadRequest('Password is not avaible');
    } else {
      return await this.usersService.deleteUserProfile(request, password);
    }
  }

  @ApiOperation({
    summary: 'Send link to verify email',
  })
  @ApiResponse({ status: 200, type: Object })
  @HttpCode(200)
  @Post('/send-email/:email')
  async setEmailPsw(@Param('email') email: string): Promise<any> {
    return this.usersService.sendVerificationEmail(email);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @ApiResponse({ status: 200, type: Object })
  @Get('verify-email/:Id')
  async verifyEmail(@Param('Id') id: string): Promise<any> {
    const user = await this.usersService.verifyUserEmail(id);
    return user;
  }
}
