import { TelegramService } from './telegram.service';
import { Orders } from 'src/orders/order.model';
import { User } from 'src/users/users.model';
export declare class TelegramController {
    private readonly telegramService;
    private ordersModel;
    private userModel;
    constructor(telegramService: TelegramService, ordersModel: Orders, userModel: User);
}
