import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from 'src/orders/order.model';
import { User } from 'src/users/users.model';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
    @InjectModel(Orders.name)
    private ordersModel: Orders,
    @InjectModel(User.name)
    private userModel: User,
  ) {}

  // @ApiOperation({ summary: 'Send Agreement message' })
  // @ApiResponse({ status: 200, type: Object })
  // @Get('/send/:phone/:chat')
  //
}
