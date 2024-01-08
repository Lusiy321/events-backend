import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { Orders } from 'src/orders/order.model';
export declare function newOrderMsg(order: Orders): string;
export declare function newOrderKeyboard(order: Orders, chatId: string): InlineKeyboardMarkup;
