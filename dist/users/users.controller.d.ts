/// <reference types="multer" />
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create.category.dto';
import { CloudinaryService } from './cloudinary.service';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    create(user: CreateUserDto): Promise<User>;
    searchUser(query: any): Promise<User[]>;
    findUsers(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findCat(): Promise<Category[]>;
    login(user: CreateUserDto): Promise<User>;
    logout(request: any): Promise<User>;
    update(data: UpdateUserDto, request: any): Promise<User>;
    uploadPhoto(req: any, images: Express.Multer.File[]): Promise<User>;
    uploadUserAvatar(req: any, images: Express.Multer.File[]): Promise<User>;
    deleteImage(id: string, req: any): Promise<User>;
    deleteAvatarImage(req: any): Promise<User>;
    googleLogin(): Promise<void>;
    googleAuthRedirect(res: any, req: any): Promise<any>;
    createCat(category: CreateCategoryDto): Promise<Category>;
    addSubcategory(id: string, subCategory: CreateCategoryDto): Promise<Category>;
    findCategoryId(id: string): Promise<User[]>;
    findSubcategoryId(id: string): Promise<User[]>;
    refresh(request: any): Promise<User>;
    cangePwd(request: any, password: PasswordUserDto): Promise<User>;
    forgotPwd(email: MailUserDto): Promise<[import("@sendgrid/mail").ClientResponse, {}]>;
    setUpdatePsw(id: string, password: UpdatePasswordUserDto): Promise<User>;
    verifyEmail(id: string, res: any): Promise<any>;
}
