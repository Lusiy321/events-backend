import {
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  Param,
  Post,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TwilioService } from './twilio.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly twilioService: TwilioService,
    @InjectModel(Orders.name)
    private ordersModel: Orders,
  ) {}

  @ApiOperation({
    summary: 'Search orders from query ( ?req=музикант&loc=Київ )',
  })
  @ApiResponse({ status: 200, type: [Orders] })
  @Get('/')
  async searchUser(@Query() query: any): Promise<any> {
    return this.ordersService.searchOrders(query);
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
  @ApiResponse({ status: 200, type: Orders })
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

  @ApiOperation({ summary: 'Send sms code' })
  @ApiResponse({ status: 200, type: Orders })
  @HttpCode(200)
  @Post('/send-code/:phone')
  async sendVerificationCode(@Param('phone') phoneNumber: string) {
    try {
      const user = await this.ordersModel.findOne({ phone: phoneNumber });
      if (user.verify === false) {
        const phone = '+' + phoneNumber;
        await this.twilioService.sendSMS(
          phone,
          `Your verification code: ${user.sms}`,
        );
        return user;
      } else if (user.verify === true) {
        throw new Conflict('User is verified');
      } else {
        throw new NotFound('User not found');
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  @ApiOperation({ summary: 'Verivy sms order' })
  @ApiResponse({ status: 200, type: Orders })
  @HttpCode(200)
  @Post('/verify/:code')
  async verifyBySms(@Param('code') code: string): Promise<Orders> {
    await this.ordersService.verifyOrder(code);
    return await this.ordersModel.findOne({ sms: code });
  }

  @ApiOperation({ summary: 'Get all user orders' })
  @ApiResponse({ status: 200, type: Orders })
  @Get('/phone/:phone')
  async findPhoneUser(@Param('phone') phone: string): Promise<Orders[]> {
    return this.ordersService.findOrderByPhone(phone);
  }
}
