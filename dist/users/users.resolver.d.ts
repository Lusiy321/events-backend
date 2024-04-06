import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import { SearchService } from './search.service';
import { search_result } from './dto/update.user.dto';
export declare class SearchQuery {
    req?: string;
    loc?: string;
    page?: number;
    cat?: string;
    subcat?: string;
    limit?: number;
}
export declare class UsersResolver {
    private readonly usersService;
    private readonly searchService;
    constructor(usersService: UsersService, searchService: SearchService);
    getUsers(query: SearchQuery): Promise<search_result>;
    getUserById(id: string): Promise<User>;
    createUser(data: CreateUserDto): Promise<User>;
    deleteUser(req: object, password: PasswordUserDto): Promise<User>;
}
