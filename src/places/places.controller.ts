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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from '../users/utils/Guards';
import { FacebookAuthGuard } from '../users/utils/GuardFacebook';
import { diskStorage } from 'multer';
import * as path from 'path';
import { Categories } from '../users/utils/user.types';
import { PlacesService } from './places.service';
import { CloudinaryService } from 'src/users/cloudinary.service';
import { Place } from './places.model';
import { CreatePlaceDto } from './dto/create.place.dto';
import { CategoryPlace } from './category.place.model';
import { LoginUserDto } from 'src/users/dto/login.user.dto';
import { UpdatePlaceDto } from './dto/update.place.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/users/users.model';
import { DelUserMediaDto } from './dto/delete.user.dto';
import { GoogleUserDto } from 'src/users/dto/google.user.dto';
import { PasswordChangeDto } from 'src/users/dto/change-password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { PasswordUserDto } from 'src/users/dto/password.user.dto';

@Controller('places')
export class PlacesController {
  constructor(
    private readonly placesService: PlacesService,
    // private readonly searchService: SearchService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  [x: string]: any;

  @ApiOperation({ summary: 'Create Place' })
  @ApiResponse({ status: 201, type: Place })
  @Post('/')
  async create(@Body() place: CreatePlaceDto): Promise<Place> {
    return this.placesService.create(place);
  }

  //   @ApiOperation({
  //     summary: 'Search posts from query ( ?req=музикант&loc=Київ )',
  //   })
  //   @ApiResponse({ status: 200, type: [User] })
  //   @Get('/')
  //   async searchUser(@Query() query: any): Promise<any> {
  //     return this.searchService.searchUsers(query);
  //   }

  @ApiOperation({ summary: 'Get all places' })
  @ApiResponse({ status: 200, type: Place })
  @Get('/find')
  async findPlaces(): Promise<Place[]> {
    return this.placesService.findAllPlaces();
  }

  @ApiOperation({ summary: 'Get place by ID' })
  @ApiResponse({ status: 200, type: Place })
  @Get('/find/:id')
  async findById(@Param('id') id: string): Promise<Place> {
    return this.placesService.findById(id);
  }

  @ApiOperation({ summary: 'Get category' })
  @ApiResponse({ status: 200, type: CategoryPlace })
  @Get('category')
  async findCat(): Promise<CategoryPlace[]> {
    return this.placesService.findCategory();
  }

  @ApiOperation({ summary: 'Login Place' })
  @ApiResponse({ status: 200, type: Place })
  @HttpCode(200)
  @Post('login')
  async login(@Body() place: LoginUserDto): Promise<Place> {
    return await this.placesService.login(place);
  }

  @ApiOperation({ summary: 'Logout Place' })
  @ApiResponse({ status: 200, type: Place })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() request: any): Promise<Place> {
    return this.placesService.logout(request);
  }

  @ApiOperation({ summary: 'Update place' })
  @ApiResponse({ status: 200, type: Place })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/')
  async update(
    @Body() data: UpdatePlaceDto,
    @Req() request: any,
  ): Promise<Place> {
    return this.placesService.updatePlace(data, request);
  }

  @ApiOperation({ summary: 'Update place category' })
  @ApiResponse({ status: 200, type: Place })
  @ApiBearerAuth('BearerAuthMethod')
  @Put('/update-category')
  async updateCat(
    @Body() data: Categories,
    @Req() request: any,
  ): Promise<Place> {
    return this.placesService.updateCategory(data, request);
  }

  @ApiOperation({ summary: 'Delet place category' })
  @ApiResponse({ status: 200, type: Place })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('/category/:id')
  async delCat(@Param('id') id: string, @Req() request: any): Promise<Place> {
    return this.placesService.deleteCategory(id, request);
  }

  //   @ApiOperation({ summary: 'Upload images' })
  //   @ApiResponse({ status: 200, type: Place })
  //   @ApiBearerAuth('BearerAuthMethod')
  //   @HttpCode(200)
  //   @Post('upload')
  //   @UseInterceptors(
  //     FilesInterceptor('file', 5, {
  //       storage: diskStorage({
  //         destination: './uploads',
  //         filename: (req, file, cb) => {
  //           const filename =
  //             path.parse(file.originalname).name.replace(/\s/g, '') +
  //             '-' +
  //             Date.now();
  //           const extension = path.parse(file.originalname).ext;
  //           cb(null, `${filename}${extension}`);
  //         },
  //       }),
  //     }),
  //   )
  //   async uploadPhoto(
  //     @Req() req: any,
  //     @UploadedFiles() images: Express.Multer.File[],
  //   ): Promise<Place> {
  //     const place = await this.placesService.findToken(req);
  //     await this.cloudinaryService.uploadImages(place, images);
  //     return await this.placesService.findById(place.id);
  //   }

  //   @ApiOperation({ summary: 'Avatar image upload' })
  //   @ApiResponse({ status: 200, type: User })
  //   @ApiBearerAuth('BearerAuthMethod')
  //   @Post('avatar')
  //   @UseInterceptors(
  //     FilesInterceptor('file', 5, {
  //       storage: diskStorage({
  //         destination: './uploads',
  //         filename: (req, file, cb) => {
  //           const filename =
  //             path.parse(file.originalname).name.replace(/\s/g, '') +
  //             '-' +
  //             Date.now();
  //           const extension = path.parse(file.originalname).ext;
  //           cb(null, `${filename}${extension}`);
  //         },
  //       }),
  //     }),
  //   )
  //   async uploadUserAvatar(
  //     @Req() req: any,
  //     @UploadedFiles() images: Express.Multer.File[],
  //   ): Promise<User> {
  //     const user = await this.usersService.findToken(req);
  //     await this.cloudinaryService.uploadAvatar(user, images);
  //     return await this.usersService.findById(user.id);
  //   }

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
  @Delete('delete-profile')
  async deleteProfile(
    @Res() res: any,
    @Req() request: any,
    @Body() password: PasswordUserDto,
  ) {
    return await this.usersService.deleteUserProfile(request, password);
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
