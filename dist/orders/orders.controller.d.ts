import { OrdersService } from './orders.service';
import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
export declare class OrdersController {
    private readonly ordersService;
    private ordersModel;
    constructor(ordersService: OrdersService, ordersModel: Orders);
    searchUser(query: any): Promise<any>;
    findOrders(): Promise<Orders[]>;
    findIdOrders(id: string): Promise<Orders>;
    create(user: CreateOrderDto): Promise<Orders>;
    bot(res: any): Promise<any>;
    verifyBySms(code: string): Promise<Orders>;
    findPhoneUser(phone: string): Promise<Orders[]>;
}
