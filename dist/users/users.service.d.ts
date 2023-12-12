import { User } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto, search_result } from './dto/update.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import * as sgMail from '@sendgrid/mail';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Category } from './category.model';
export declare class UsersService {
    private userModel;
    private categoryModel;
    constructor(userModel: User, categoryModel: Category);
    searchUsers(query: any): Promise<search_result>;
    findAllUsers(): Promise<User[]>;
    findById(id: string): Promise<User>;
    create(user: CreateUserDto): Promise<User>;
    checkTrialStatus(id: string): Promise<boolean>;
    sendVerificationEmail(email: string, verificationLink: string): Promise<void>;
    verifyUserEmail(id: any): Promise<void>;
    changePassword(req: any, newPass: PasswordUserDto): Promise<User>;
    validateUser(details: GoogleUserDto): Promise<any>;
    restorePassword(email: MailUserDto): Promise<[sgMail.ClientResponse, {}]>;
    updateRestorePassword(id: string, newPass: UpdatePasswordUserDto): Promise<User>;
    login(user: CreateUserDto): Promise<User>;
    logout(req: any): Promise<User>;
    update(user: UpdateUserDto, req: any): Promise<User>;
    deleteUserVideo(id: string, req: any): Promise<any>;
    findOrCreateUser(googleId: string, firstName: string, email: string): Promise<any>;
    findToken(req: any): Promise<User>;
    createToken(authUser: {
        _id: string;
    }): Promise<any>;
    refreshAccessToken(req: any): Promise<User>;
    findCategory(): Promise<Category[]>;
}
