import { AdminService } from './admin.service';
import { User } from 'src/users/users.model';
import { Admin } from './admin.model';
import { CreateAdminDto } from './dto/create.admin.dto';
import { VerifyUserDto } from 'src/users/dto/verify.user.dto';
import { UpdateUserAdmDto } from './dto/update.user.adm.dto';
import { CreateCategoryDto } from 'src/users/dto/create.category.dto';
import { Category } from 'src/users/category.model';
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
    createCat(category: CreateCategoryDto, request: any): Promise<Category>;
    addSubcategory(id: string, subCategory: CreateCategoryDto, request: any): Promise<Category>;
    findCategoryId(id: string, request: any): Promise<User[]>;
    findSubcategoryId(id: string, request: any): Promise<User[]>;
}
