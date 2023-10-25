/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
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

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 200, type: User })
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
  @Post('login')
  async login(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.login(user);
  }

  @ApiOperation({ summary: 'Logout User' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('logout')
  async logout(@Req() request: any): Promise<User> {
    return this.usersService.logout(request);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/')
  async update(
    @Body() user: UpdateUserDto,
    @Req() request: any,
  ): Promise<User> {
    return this.usersService.update(user, request);
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
    return res.redirect(
      `https://show-git-main-smirnypavel.vercel.app/?token=${user.token}`,
    );
  }

  @ApiOperation({ summary: 'Создание категории в БД с категориями' })
  @ApiResponse({ status: 200, type: Category })
  @Post('/category/add')
  async createCat(@Body() category: CreateCategoryDto): Promise<Category> {
    return this.usersService.createCategory(category);
  }

  @ApiOperation({ summary: 'Добавление подкатегории в БД с категориями' })
  @ApiResponse({ status: 200, type: Category })
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

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('change-password')
  async cangePwd(@Req() request: any, @Body() password: PasswordUserDto) {
    return await this.usersService.changePassword(request, password);
  }

  @ApiOperation({ summary: 'Forgot password email send' })
  @Post('forgot-password')
  async forgotPwd(@Body() email: MailUserDto) {
    return await this.usersService.restorePassword(email);
  }

  @ApiOperation({
    summary: 'Update password for forgot password',
  })
  @ApiResponse({ status: 200, type: User })
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

  // @ApiOperation({ summary: 'Send telegram message' })
  // @Post('send')
  // async sendNotification(@Body() data: { chatId: number; message: string }) {
  //   const { chatId, message } = data;
  //   await this.telegramService.sendMessage(chatId, message);
  //   return { success: true, message: 'Уведомление успешно отправлено' };
  // }
}

// @ApiOperation({ summary: 'Login Facebook User' })
// @Get('facebook/login')
// @UseGuards(AuthGuard('facebook'))
// async facebookLogin() {
//   return console.log('object');
// }
// @ApiOperation({ summary: 'Facebook Authentication' })
// @Get('facebook/redirect')
// @UseGuards(AuthGuard('facebook'))
// async facebookLoginCallback(@Req() req: any, @Res() res: any) {
//   // const userId = req.user.id;
//   // const user = await this.usersService.findById(userId);
//   return res.redirect(`https://show-git-main-smirnypavel.vercel.app/?token=`);
// }
