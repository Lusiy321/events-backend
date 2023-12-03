import * as TelegramBot from 'node-telegram-bot-api';
export declare const ViberBot: any;
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
export declare class MesengersService {
    private ordersModel;
    private userModel;
    private viber_bot;
    private tg_bot;
    constructor(ordersModel: Orders, userModel: User);
    sendNewViberOrder(userId: string, order: Orders): Promise<void>;
    sendViberAgreement(orderPhone: string, userChatId: string): Promise<boolean>;
    startServer(): any;
    sendMessage(chatId: string, msg: string): Promise<TelegramBot.Message>;
    sendTgAgreement(phone: string, chatId: string): Promise<boolean>;
    sendNewTgOrder(chatId: string, order: Orders): Promise<TelegramBot.Message>;
}
