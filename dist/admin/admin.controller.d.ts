import { AdminService } from './admin.service';
import { User } from 'src/users/users.model';
import { Admin } from './admin.model';
import { CreateAdminDto } from './dto/create.admin.dto';
import { VerifyUserDto } from 'src/users/dto/verify.user.dto';
import { UpdateUserAdmDto } from './dto/update.user.adm.dto';
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
    find(id: string, user: UpdateUserAdmDto, req: any): Promise<User>;
    setVerify(usr: VerifyUserDto, id: string, request: any): Promise<User>;
    deleteUrs(request: any, data: object): Promise<Object>;
    setBan(id: string, request: any): Promise<User>;
}
