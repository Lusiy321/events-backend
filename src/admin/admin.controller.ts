import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Orders } from 'src/orders/order.model';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.model';
import { Admin } from './admin.model';
import { CreateAdminDto } from './dto/create.admin.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  [x: string]: any;

  @ApiOperation({ summary: 'Create Admin (only "superadmin" role)' })
  @ApiResponse({ status: 201, type: Admin })
  @ApiBearerAuth('BearerAuthMethod')
  @Post('/')
  async create(@Body() adm: CreateAdminDto, @Req() req: any): Promise<Admin> {
    return this.adminService.createAdmin(adm, req);
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
}
