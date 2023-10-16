import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TwilioService } from './twilio.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly twilioService: TwilioService,
  ) {}

  @ApiOperation({ summary: 'Send code' })
  @ApiResponse({ status: 200, type: Orders })
  @Post('/send-code')
  async sendVerificationCode(@Body() phoneNumber: any) {
    const { phone } = phoneNumber;
    function generateSixDigitNumber() {
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const verificationCode = generateSixDigitNumber();

    await this.twilioService.sendSMS(
      phone,
      `Your verification code: ${verificationCode}`,
    );
    return;
  }
}
