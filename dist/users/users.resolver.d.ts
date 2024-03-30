import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    createUser(data: CreateUserDto): Promise<User>;
    deleteUser(req: object, password: PasswordUserDto): Promise<User>;
}
