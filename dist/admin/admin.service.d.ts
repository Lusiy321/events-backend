import { CreateAdminDto } from './dto/create.admin.dto';
import { Admin } from './admin.model';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
import { VerifyUserDto } from 'src/users/dto/verify.user.dto';
export declare class AdminService {
    private adminModel;
    private userModel;
    private ordersModel;
    constructor(adminModel: Admin, userModel: User, ordersModel: Orders);
    createAdmin(admin: CreateAdminDto, req: any): Promise<Admin>;
    login(user: CreateAdminDto): Promise<Admin>;
    logout(req: any): Promise<Admin>;
    findAllAdmins(req: any): Promise<Admin[]>;
    findAdminById(id: string, req: any): Promise<Admin>;
    findByIdUpdate(id: string, user: UpdateUserDto, req: any): Promise<User>;
    banUser(id: string, req: any): Promise<User>;
    deleteUser(id: string, req: any): Promise<User>;
    deleteOrder(id: string, req: any): Promise<Orders>;
    verifyUser(id: string, req: any, userUp: VerifyUserDto): Promise<User>;
    findToken(req: any): Promise<Admin>;
    createToken(authUser: {
        _id: string;
    }): Promise<any>;
    refreshAccessToken(req: any): Promise<Admin>;
}