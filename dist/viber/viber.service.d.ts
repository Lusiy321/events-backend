export declare const ViberBot: any;
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
import { TelegramService } from 'src/telegram/telegram.service';
export declare class ViberService {
    private readonly telegramService;
    private userModel;
    private orderModel;
    private app;
    private bot;
    constructor(telegramService: TelegramService, userModel: User, orderModel: Orders);
    sendNewOrder(userId: string, order: Orders): Promise<void>;
    sendAgreement(phone: string, chatId: string): Promise<boolean>;
    startServer(): any;
}
