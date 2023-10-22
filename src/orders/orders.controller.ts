import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
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

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, type: Orders })
  @Get('/find')
  async findOrders(): Promise<Orders[]> {
    return this.ordersService.findAllOrders();
  }

  @ApiOperation({ summary: 'Create Order' })
  @ApiResponse({ status: 200, type: Orders })
  @Post('/')
  async create(@Body() user: CreateOrderDto): Promise<Orders> {
    return this.ordersService.create(user);
  }

  @ApiOperation({ summary: 'Send sms code' })
  @ApiResponse({ status: 200, type: Orders })
  @Post('/send-code/:phone')
  async sendVerificationCode(@Param('phone') phoneNumber: string) {
    const user = await this.ordersModel.findOne({ phone: phoneNumber });
    try {
      await this.twilioService.sendSMS(
        phoneNumber,
        `Your verification code: ${user.sms}`,
      );
    } catch (e) {
      throw new BadRequest(e.message);
    }
    return await this.ordersModel.findOne({ phone: phoneNumber });
  }

  @ApiOperation({ summary: 'Verivy sms order' })
  @ApiResponse({ status: 200, type: Orders })
  @Post('/verify/:code')
  async verifyBySms(@Param('code') code: string): Promise<Orders> {
    await this.ordersService.verifyOrder(code);
    return await this.ordersModel.findOne({ sms: code });
  }
}
