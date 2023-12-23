/// <reference types="multer" />
import { User } from './users.model';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { Category } from './category.model';
import { CloudinaryService } from './cloudinary.service';
import { DelUserMediaDto } from './dto/delete.user.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly cloudinaryService;
    constructor(usersService: UsersService, cloudinaryService: CloudinaryService);
    [x: string]: any;
    create(user: CreateUserDto): Promise<User>;
    searchUser(query: any): Promise<any>;
    findUsers(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findCat(): Promise<Category[]>;
    login(user: CreateUserDto): Promise<User>;
    logout(request: any): Promise<User>;
    update(data: UpdateUserDto, request: any): Promise<User>;
    uploadPhoto(req: any, images: Express.Multer.File[]): Promise<User>;
    uploadUserAvatar(req: any, images: Express.Multer.File[]): Promise<User>;
    deleteImage(id: DelUserMediaDto, req: any): Promise<User>;
    deleteVideo(id: string, req: any): Promise<User>;
    deleteAvatarImage(req: any): Promise<User>;
    googleLogin(): void;
    googleAuthRedirect(res: any, req: any): Promise<any>;
    facebookLogin(): void;
    facebookAuthRedirect(res: any, req: any): Promise<any>;
    refresh(request: any): Promise<User>;
    cangePwd(request: any, password: PasswordUserDto): Promise<User>;
    forgotPwd(email: MailUserDto): Promise<{
        message: string;
    }>;
    setUpdatePsw(id: string, password: UpdatePasswordUserDto): Promise<User>;
    setEmailPsw(id: string): Promise<any>;
    verifyEmail(id: string, res: any): Promise<any>;
    callback(data: any): any;
}
