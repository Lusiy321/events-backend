import * as TelegramBot from 'node-telegram-bot-api';
import { Orders } from 'src/orders/order.model';
import { User } from 'src/users/users.model';
export declare class TelegramService {
    private ordersModel;
    private userModel;
    private bot;
    constructor(ordersModel: Orders, userModel: User);
    sendMessage(chatId: string, msg: string): Promise<TelegramBot.Message>;
    sendAgreement(phone: string, chatId: string): Promise<void>;
    sendNewOrder(chatId: string, order: Orders): Promise<TelegramBot.Message>;
}
