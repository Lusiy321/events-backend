import { OrdersService } from './orders.service';
import { TwilioService } from './twilio.service';
import { Orders } from './order.model';
export declare class OrdersController {
    private readonly ordersService;
    private readonly twilioService;
    private ordersModel;
    constructor(ordersService: OrdersService, twilioService: TwilioService, ordersModel: Orders);
    findOrders(): Promise<Orders[]>;
    findIdOrders(id: string): Promise<Orders>;
    sendVerificationCode(phoneNumber: string): Promise<any>;
    verifyBySms(code: string): Promise<Orders>;
    findPhoneUser(phone: string): Promise<Orders>;
}
