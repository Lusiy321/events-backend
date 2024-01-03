import { Orders } from './order.model';
import { CreateOrderDto } from './dto/create.order.dto';
import { User } from 'src/users/users.model';
import { MesengersService } from 'src/orders/mesengers.service';
export declare class OrdersService {
    private readonly mesengersService;
    private ordersModel;
    private userModel;
    constructor(mesengersService: MesengersService, ordersModel: Orders, userModel: User);
    findAllOrders(): Promise<Orders[]>;
    findOrderById(id: string): Promise<Orders>;
    findOrderByPhone(phone: string): Promise<Orders[]>;
    generateSixDigitNumber(): Promise<number>;
    create(orderObj: CreateOrderDto): Promise<Orders>;
    verifyOrder(code: string): Promise<any>;
    checkTrialStatus(id: string): Promise<boolean>;
    findUserByCategory(order: Orders): Promise<any>;
    searchOrders(query: any): Promise<any>;
}
