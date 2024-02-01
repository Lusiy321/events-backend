/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import * as TelegramBot from 'node-telegram-bot-api';
export declare const ViberBot: any;
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
import { OrdersArchive } from './order.archive.model';
import { Model } from 'mongoose';
export declare class MesengersService {
    private ordersModel;
    private ordersArchiveModel;
    private userModel;
    private viber_bot;
    private tg_bot;
    constructor(ordersModel: Orders, ordersArchiveModel: Model<OrdersArchive>, userModel: User);
    sendNewViberOrder(userId: string, order: Orders): Promise<void>;
    sendViberAgreement(orderPhone: string, userChatId: string): Promise<boolean>;
    myOrdersList(chatId: string): Promise<void>;
    myReviewList(chatId: string): Promise<void>;
    sendMessagesToAllViberUsers(msg: string): Promise<void>;
    sendMessageViber(chatId: string, msg: string): Promise<any>;
    startServer(): Promise<void>;
    sendMessageTg(chatId: string, msg: string): Promise<TelegramBot.Message>;
    sendMessagesToAllTgUsers(msg: string): Promise<void>;
    sendCode(chatId: string, code: number): Promise<void>;
    sendTgAgreement(phone: string, chatId: string): Promise<boolean>;
    sendNewTgOrder(chatId: number, order: Orders): Promise<TelegramBot.Message>;
}
