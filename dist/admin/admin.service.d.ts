import { CreateAdminDto } from './dto/create.admin.dto';
import { Admin } from './admin.model';
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
import { VerifyUserDto } from 'src/users/dto/verify.user.dto';
import { UpdateUserAdmDto } from './dto/update.user.adm.dto';
import { LoginAdminDto } from './dto/login.admin.dto';
import { CreateCategoryDto } from 'src/users/dto/create.category.dto';
import { Category } from 'src/users/category.model';
import { Subcategory } from 'src/users/utils/user.types';
export declare class AdminService {
    private adminModel;
    private userModel;
    private ordersModel;
    private categoryModel;
    constructor(adminModel: Admin, userModel: User, ordersModel: Orders, categoryModel: Category);
    createAdmin(admin: CreateAdminDto, req: any): Promise<Admin>;
    login(user: LoginAdminDto): Promise<Admin>;
    logout(req: any): Promise<Admin>;
    findAllAdmins(req: any): Promise<Admin[]>;
    findAdminById(id: string, req: any): Promise<Admin>;
    findByIdUpdate(id: string, user: UpdateUserAdmDto, req: any): Promise<User>;
    banUser(id: string, req: any): Promise<User>;
    deleteUser(req: any, data: object): Promise<Object[]>;
    verifyUser(id: string, req: any, userUp: VerifyUserDto): Promise<User>;
    findToken(req: any): Promise<Admin>;
    createToken(authUser: {
        _id: string;
    }): Promise<any>;
    refreshAccessToken(req: any): Promise<Admin>;
    createCategory(req: any, category: CreateCategoryDto): Promise<Category>;
    addSubcategory(req: any, catId: string, subCategory: Subcategory): Promise<Category>;
    findUserCategory(req: any, id: string): Promise<any>;
    findUserSubcategory(req: any, id: string): Promise<any>;
}
