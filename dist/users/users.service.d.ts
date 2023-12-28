import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto, search_result } from './dto/update.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Category } from './category.model';
import { Categories } from './dto/caterory.interface';
import * as nodemailer from 'nodemailer';
import { LoginUserDto } from './dto/login.user.dto';
export declare const TRANSPORTER_PROVIDER = "TRANSPORTER_PROVIDER";
export declare class UsersService {
    private userModel;
    private categoryModel;
    private transporter;
    constructor(userModel: User, categoryModel: Category, transporter: nodemailer.Transporter);
    searchUsers(query: any): Promise<search_result>;
    findAllUsers(): Promise<User[]>;
    findById(id: string): Promise<User>;
    create(user: CreateUserDto): Promise<User>;
    checkTrialStatus(id: string): Promise<boolean>;
    sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
    verifyUserEmail(id: any): Promise<void>;
    changePassword(req: any, newPass: PasswordUserDto): Promise<User>;
    validateUser(details: GoogleUserDto): Promise<any>;
    validateFacebook(details: any): Promise<any>;
    restorePassword(email: MailUserDto): Promise<any>;
    login(user: LoginUserDto): Promise<User>;
    logout(req: any): Promise<User>;
    update(user: UpdateUserDto, req: any): Promise<User>;
    updateCategory(data: Categories, req: any): Promise<User>;
    deleteCategory(id: string, req: any): Promise<any>;
    deleteUserVideo(id: string, req: any): Promise<any>;
    findOrCreateUser(googleId: string, firstName: string, email: string): Promise<any>;
    findToken(req: any): Promise<User>;
    createToken(authUser: {
        _id: string;
    }): Promise<any>;
    refreshAccessToken(req: any): Promise<User>;
    findCategory(): Promise<Category[]>;
    monoPayment(amount: number): Promise<void>;
}
