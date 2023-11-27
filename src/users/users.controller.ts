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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { GoogleAuthGuard } from './utils/Guards';
import { PasswordUserDto } from './dto/password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create.category.dto';
import { STATUS_CODES } from 'http';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, type: User })
  @Post('/')
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @ApiOperation({ summary: 'Search posts from query ( ?req= )' })
  @ApiResponse({ status: 200, type: [User] })
  @Get('/')
  async searchUser(@Query() query: any): Promise<User[]> {
    return this.usersService.searchUsers(query);
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
  async login(@Body() user: CreateUserDto): Promise<User> {
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

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/')
  async update(
    @Body() data: UpdateUserDto,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.update(data, request);
  }

  @ApiOperation({ summary: 'Upload images' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
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
    const user = await this.usersService.findToken(req);
    await this.cloudinaryService.uploadImages(user, images);
    return await this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Avatar image upload' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('avatar')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
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
    console.log(images);
    await this.cloudinaryService.uploadAvatar(user, images);
    await this.cloudinaryService.deleteFilesInUploadsFolder();
    return await this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Delete user photo' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('/photo/:id')
  async deleteImage(@Param('id') id: string, @Req() req: any): Promise<User> {
    const user = await this.usersService.findToken(req);
    await this.cloudinaryService.deleteImage(user, id);
    return await this.usersService.findById(user.id);
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
  async googleLogin() {
    return;
  }

  @ApiOperation({ summary: 'Google Authentication' })
  @ApiResponse({ status: 200, type: GoogleUserDto })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Res() res: any, @Req() req: any) {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return res.redirect(`${process.env.FRONT_LINK}?token=${user.token}`);
  }

  @ApiOperation({ summary: 'Создание категории в БД с категориями' })
  @ApiResponse({ status: 200, type: Category })
  @HttpCode(200)
  @Post('/category/add')
  async createCat(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.usersService.createCategory(category);
  }

  @ApiOperation({ summary: 'Добавление подкатегории в БД с категориями' })
  @ApiResponse({ status: 200, type: Category })
  @HttpCode(200)
  @Post('/subcategories/:id')
  async addSubcategory(
    @Param('id') id: string,
    @Body() subCategory: CreateCategoryDto,
  ): Promise<Category> {
    return this.usersService.addSubcategory(id, subCategory);
  }

  @ApiOperation({ summary: 'Сортировка по категориям пользователей' })
  @ApiResponse({ status: 200, type: User })
  @Get('/findCategory/:id')
  async findCategoryId(@Param('id') id: string): Promise<User[]> {
    return this.usersService.findUserCategory(id);
  }

  @ApiOperation({ summary: 'Сортировка по подкатегориям пользователей' })
  @ApiResponse({ status: 200, type: User })
  @Get('/findSubcategory/:id')
  async findSubcategoryId(@Param('id') id: string): Promise<User[]> {
    return this.usersService.findUserSubcategory(id);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('refresh')
  async refresh(@Req() request: any) {
    return await this.usersService.refreshAccessToken(request);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('change-password')
  async cangePwd(@Req() request: any, @Body() password: PasswordUserDto) {
    return await this.usersService.changePassword(request, password);
  }

  @ApiOperation({ summary: 'Forgot password email send' })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPwd(@Body() email: MailUserDto) {
    return await this.usersService.restorePassword(email);
  }

  @ApiOperation({
    summary: 'Update password for forgot password',
  })
  @ApiResponse({ status: 200, type: User })
  @HttpCode(200)
  @Post('/update-password/:Id')
  async setUpdatePsw(
    @Param('Id') id: string,
    @Body() password: UpdatePasswordUserDto,
  ): Promise<User> {
    return this.usersService.updateRestorePassword(id, password);
  }

  @ApiOperation({ summary: 'Verify user email' })
  @Patch('verify-email/:Id')
  async verifyEmail(@Param('Id') id: string, @Res() res: any) {
    await this.usersService.verifyUserEmail(id);
    return res.redirect(`https://show-git-main-smirnypavel.vercel.app`);
  }
}
