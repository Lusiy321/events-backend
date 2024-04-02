import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
import { SearchService } from 'src/users/search.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly searchService: SearchService,
  ) {}

  @ApiOperation({
    summary: 'Search orders from query ( ?req=музикант&loc=Київ )',
  })
  @ApiResponse({ status: 200, type: [Orders] })
  @Get('/')
  async searchUser(@Query() query: any): Promise<any> {
    return this.searchService.searchOrders(query);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, type: Orders })
  @Get('/find')
  async findOrders(): Promise<Orders[]> {
    return this.ordersService.findAllOrders();
  }

  @ApiOperation({ summary: 'Get orders by id' })
  @ApiResponse({ status: 200, type: Orders })
  @Get('/find/:id')
  async findIdOrders(@Param('id') id: string): Promise<Orders> {
    return this.ordersService.findOrderById(id);
  }

  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({ status: 201, type: Orders })
  @Post('/')
  async create(@Body() user: CreateOrderDto): Promise<Orders> {
    return this.ordersService.create(user);
  }

  @ApiOperation({ summary: 'Redirect to viber bot page BOT' })
  @ApiResponse({ status: 200, type: Orders })
  @Get('/bot')
  async bot(@Res() res: any) {
    return res.redirect('viber://pa?chatURI=wechirka', 200);
  }

  @ApiOperation({ summary: 'Verivy sms order' })
  @ApiResponse({ status: 200, type: Orders })
  @HttpCode(200)
  @Post('/verify/:code')
  async verifyBySms(@Param('code') code: number): Promise<Orders> {
    return await this.ordersService.verifyOrder(code);
  }

  @ApiOperation({ summary: 'Get all user orders' })
  @ApiResponse({ status: 200, type: Orders })
  @Get('/phone/:phone')
  async findPhoneUser(@Param('phone') phone: string): Promise<Orders[]> {
    return this.ordersService.findOrderByPhone(phone);
  }
}
