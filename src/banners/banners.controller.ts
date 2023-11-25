import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { Banner } from './banners.model';
import { CreateBannerDto } from './dto/create.banners.dto';

@ApiTags('Banner')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannerService: BannersService) {}

  @ApiOperation({ summary: 'Create banner' })
  @ApiResponse({ status: 201, type: Banner })
  @Post('/')
  async create(@Body() data: CreateBannerDto): Promise<Banner> {
    return this.bannerService.createBanner(data);
  }
  @ApiOperation({
    summary: 'Get all banners',
  })
  @ApiResponse({ status: 200, type: Banner })
  @Get('/')
  async findBanners(): Promise<Banner[]> {
    return this.bannerService.findAllBanners();
  }

  @ApiOperation({
    summary: 'Get banner by ID',
  })
  @ApiResponse({ status: 200, type: Banner })
  @Get('/:id')
  async findBannerById(@Param('id') id: string): Promise<Banner> {
    return this.bannerService.findBannerById(id);
  }
  @ApiOperation({
    summary: 'Update banner by ID',
  })
  @ApiResponse({ status: 200, type: Banner })
  @Put('/:id')
  async updateBanners(
    @Param('id') id: string,
    @Body() data: CreateBannerDto,
  ): Promise<Banner> {
    return this.bannerService.updateBanner(id, data);
  }

  @ApiOperation({
    summary: 'Remove banner by ID',
  })
  @ApiResponse({ status: 200, type: Banner })
  @Delete('/:id')
  async findBannerAndDel(@Param('id') id: string): Promise<Banner> {
    return this.bannerService.deleteBanner(id);
  }
}
