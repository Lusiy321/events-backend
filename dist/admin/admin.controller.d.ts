import { AdminService } from './admin.service';
import { User } from 'src/users/users.model';
import { Admin } from './admin.model';
import { CreateAdminDto } from './dto/create.admin.dto';
import { UpdateUserDto } from 'src/users/dto/update.user.dto';
import { Orders } from 'src/orders/order.model';
import { VerifyUserDto } from 'src/users/dto/verify.user.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    [x: string]: any;
    create(adm: CreateAdminDto, req: any): Promise<Admin>;
    findAdmins(req: any): Promise<Admin[]>;
    findAdminId(id: string, req: any): Promise<Admin>;
    login(adm: CreateAdminDto): Promise<Admin>;
    logout(req: any): Promise<Admin>;
    refresh(req: any): Promise<Admin>;
    find(id: string, user: UpdateUserDto, req: any): Promise<User>;
    setVerify(usr: VerifyUserDto, id: string, request: any): Promise<User>;
    deleteUrs(id: string, request: any): Promise<User>;
    deleteOrd(id: string, request: any): Promise<Orders>;
    setBan(id: string, request: any): Promise<User>;
}
