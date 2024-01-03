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
    myOrdersList(chatId: string): Promise<void>;
    myReviewList(chatId: string): Promise<void>;
    sendMessagesToAllViberUsers(msg: string): Promise<void>;
    sendMessageViber(chatId: string, msg: string): Promise<any>;
    startServer(): Promise<void>;
    sendMessageTg(chatId: string, msg: string): Promise<TelegramBot.Message>;
    sendMessagesToAllTgUsers(msg: string): Promise<void>;
    sendCode(chatId: string): Promise<void>;
    sendTgAgreement(phone: string, chatId: string): Promise<boolean>;
    sendNewTgOrder(chatId: string, order: Orders): Promise<TelegramBot.Message>;
}
