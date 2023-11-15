import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
import { TwilioService } from './twilio.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { User } from 'src/users/users.model';
import { ViberService } from 'src/viber/viber.service';
export declare class OrdersService {
    private readonly twilioService;
    private readonly telegramService;
    private readonly viberService;
    private ordersModel;
    private userModel;
    constructor(twilioService: TwilioService, telegramService: TelegramService, viberService: ViberService, ordersModel: Orders, userModel: User);
    findAllOrders(): Promise<Orders[]>;
    findOrderById(id: string): Promise<Orders>;
    findOrderByPhone(phone: string): Promise<Orders>;
    generateSixDigitNumber(): Promise<number>;
    create(order: CreateOrderDto): Promise<Orders>;
    verifyOrder(code: string): Promise<any>;
    findUserByCategory(order: Orders): Promise<any>;
}
