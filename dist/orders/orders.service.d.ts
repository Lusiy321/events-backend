import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
import { TwilioService } from './twilio.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { User } from 'src/users/users.model';
export declare class OrdersService {
    private readonly twilioService;
    private readonly telegramService;
    private ordersModel;
    private userModel;
    constructor(twilioService: TwilioService, telegramService: TelegramService, ordersModel: Orders, userModel: User);
    findAllOrders(): Promise<Orders[]>;
    findOrderByPhone(phone: string): Promise<Orders>;
    generateSixDigitNumber(): Promise<number>;
    create(order: CreateOrderDto): Promise<Orders>;
    verifyOrder(code: string): Promise<any>;
    findUserByCategory(order: Orders): Promise<any>;
}
