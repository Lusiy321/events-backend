import { Controller, Param, Post } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Send sms code' })
  @ApiResponse({ status: 200, type: Object })
  @Post('/send/:phone/:id')
  async sendAgreement(
    @Param('phone') phone: string,
    @Param('id') chatId: string,
  ) {
    const order = await this.ordersModel.findOne({ phone: phone });
    const user = await this.userModel.findOne({ tg_chat: chatId });
    if (order.tg_chat !== null) {
      const msgTrue = `Доброго дня, замовник отримав Вашу відповідь`;
      await this.telegramService.sendMessage(chatId, msgTrue);
      const msgOrder = `Користувач ${user.firstName} ${user.lastName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}.
      Посылання на профіль виконавця ${process.env.FRONT_LINK}${user._id}`;
      await this.telegramService.sendMessage(order.tg_chat, msgOrder);
    } else {
      const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
      await this.telegramService.sendMessage(chatId, msg);
    }
  }
}
