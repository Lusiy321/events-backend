import { OrdersService } from './orders.service';
import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
import { SearchService } from 'src/users/search.service';
export declare class OrdersController {
    private readonly ordersService;
    private readonly searchService;
    constructor(ordersService: OrdersService, searchService: SearchService);
    searchUser(query: any): Promise<any>;
    findOrders(): Promise<Orders[]>;
    findIdOrders(id: string): Promise<Orders>;
    create(user: CreateOrderDto): Promise<Orders>;
    bot(res: any): Promise<any>;
    verifyBySms(code: number): Promise<Orders>;
    findPhoneUser(phone: string): Promise<Orders[]>;
}
