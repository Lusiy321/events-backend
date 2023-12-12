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
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { User } from 'src/users/users.model';
import { Admin } from './admin.model';
import { CreateAdminDto } from './dto/create.admin.dto';
import { VerifyUserDto } from 'src/users/dto/verify.user.dto';
import { UpdateUserAdmDto } from './dto/update.user.adm.dto';
import { CreateCategoryDto } from 'src/users/dto/create.category.dto';
import { Category } from 'src/users/category.model';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  [x: string]: any;
  //ADMIN
  @ApiOperation({ summary: 'Create Admin (only "superadmin" role)' })
  @ApiResponse({ status: 201, type: Admin })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/')
  async create(@Body() adm: CreateAdminDto, @Req() req: any): Promise<Admin> {
    return this.adminService.createAdmin(adm, req);
  }

  @ApiOperation({
    summary: 'Get all admins (only "superadmin" and "admin" role)',
  })
  @ApiResponse({ status: 200, type: Admin })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/find')
  async findAdmins(@Req() req: any): Promise<Admin[]> {
    return this.adminService.findAllAdmins(req);
  }

  @ApiOperation({
    summary: 'Get admin by ID (only "superadmin" and "admin" role)',
  })
  @ApiResponse({ status: 200, type: Admin })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/find/:id')
  async findAdminId(@Param('id') id: string, @Req() req: any): Promise<Admin> {
    return this.adminService.findAdminById(id, req);
  }

  @ApiOperation({ summary: 'Login Admin' })
  @ApiResponse({ status: 200, type: Admin })
  @HttpCode(200)
  @Post('login')
  async login(@Body() adm: CreateAdminDto): Promise<Admin> {
    return await this.adminService.login(adm);
  }

  @ApiOperation({ summary: 'Logout Admin' })
  @ApiResponse({ status: 200, type: Admin })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: any): Promise<Admin> {
    return this.adminService.logout(req);
  }

  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('refresh')
  async refresh(@Req() req: any) {
    return await this.adminService.refreshAccessToken(req);
  }

  //USERS
  @ApiOperation({
    summary:
      'Find by ID and update all rows in User (only "admin" or "moderator" role)',
  })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Put('/find-by-id/:id')
  async find(
    @Param('id') id: string,
    @Body() user: UpdateUserAdmDto,
    @Req() req: any,
  ): Promise<User> {
    return this.adminService.findByIdUpdate(id, user, req);
  }

  @ApiOperation({
    summary: 'Verify User enum: [new, aprove, rejected]',
  })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/verify/:Id')
  async setVerify(
    @Body() usr: VerifyUserDto,
    @Param('Id') id: string,
    @Req() request: any,
  ): Promise<User> {
    return this.adminService.verifyUser(id, request, usr);
  }

  @ApiOperation({ summary: 'Delet User' })
  @ApiResponse({ status: 200, type: Object })
  @ApiBearerAuth('BearerAuthMethod')
  @Delete('/')
  async deleteUrs(@Req() request: any, @Body() data: object): Promise<Object> {
    return this.adminService.deleteUser(request, data);
  }

  @ApiOperation({ summary: 'Set ban user' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Patch('/ban/:Id')
  async setBan(@Param('Id') id: string, @Req() request: any): Promise<User> {
    return this.adminService.banUser(id, request);
  }

  @ApiOperation({ summary: 'Создание категории в БД с категориями' })
  @ApiResponse({ status: 200, type: Category })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('/category/add')
  async createCat(
    @Body() category: CreateCategoryDto,
    @Req() request: any,
  ): Promise<Category> {
    return this.adminService.createCategory(request, category);
  }

  @ApiOperation({ summary: 'Добавление подкатегории в БД с категориями' })
  @ApiResponse({ status: 200, type: Category })
  @ApiBearerAuth('BearerAuthMethod')
  @HttpCode(200)
  @Post('/subcategories/:id')
  async addSubcategory(
    @Param('id') id: string,
    @Body() subCategory: CreateCategoryDto,
    @Req() request: any,
  ): Promise<Category> {
    return this.adminService.addSubcategory(request, id, subCategory);
  }

  @ApiOperation({ summary: 'Сортировка по категориям пользователей' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/findCategory/:id')
  async findCategoryId(
    @Param('id') id: string,
    @Req() request: any,
  ): Promise<User[]> {
    return this.adminService.findUserCategory(request, id);
  }

  @ApiOperation({ summary: 'Сортировка по подкатегориям пользователей' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth('BearerAuthMethod')
  @Get('/findSubcategory/:id')
  async findSubcategoryId(
    @Param('id') id: string,
    @Req() request: any,
  ): Promise<User[]> {
    return this.adminService.findUserSubcategory(request, id);
  }
}
