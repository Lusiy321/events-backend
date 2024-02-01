import { User } from './users.model';
import { search_result } from './dto/update.user.dto';
import { Orders } from 'src/orders/order.model';
export declare class SearchService {
    private userModel;
    private ordersModel;
    constructor(userModel: User, ordersModel: Orders);
    searchUsers(query: any): Promise<search_result>;
    searchOrders(query: any): Promise<any>;
}
