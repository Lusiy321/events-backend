import * as TelegramBot from 'node-telegram-bot-api';
import { Orders } from 'src/orders/order.model';
import { User } from 'src/users/users.model';
import { HttpService } from '@nestjs/axios';
export declare class TelegramService {
    private ordersModel;
    private userModel;
    private httpService;
    private bot;
    constructor(ordersModel: Orders, userModel: User, httpService: HttpService);
    sendMessage(chatId: string, msg: string): Promise<TelegramBot.Message>;
    sendNewOrder(chatId: string, order: Orders): Promise<TelegramBot.Message>;
}
