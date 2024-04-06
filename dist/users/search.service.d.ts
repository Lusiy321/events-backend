import { User } from './users.model';
import { Orders } from '../orders/order.model';
import { search_result } from './dto/update.user.dto';
import { SearchQuery } from './users.resolver';
export declare class SearchService {
    private userModel;
    private ordersModel;
    constructor(userModel: User, ordersModel: Orders);
    searchUsers(query: SearchQuery): Promise<search_result>;
    searchOrders(query: any): Promise<any>;
}
