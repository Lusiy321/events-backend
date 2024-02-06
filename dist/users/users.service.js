"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = exports.TRANSPORTER_PROVIDER = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
const bcryptjs_1 = require("bcryptjs");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const category_model_1 = require("./category.model");
const email_schemas_1 = require("./utils/email.schemas");
const parse_user_1 = require("./utils/parse.user");
const nodemailer = require("nodemailer");
exports.TRANSPORTER_PROVIDER = 'TRANSPORTER_PROVIDER';
let UsersService = class UsersService {
    constructor(userModel, categoryModel, transporter) {
        this.userModel = userModel;
        this.categoryModel = categoryModel;
        this.transporter = transporter;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NOREPLY_MAIL,
                pass: process.env.NOREPLY_PASSWORD,
            },
        });
    }
    async findAllUsers() {
        try {
            const find = await this.userModel.find().select(parse_user_1.rows);
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findById(id) {
        try {
            const find = await this.userModel.findById(id).select('-password').exec();
            await this.checkTrialStatus(id);
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async create(user) {
        try {
            const { email, password, phone, firstName } = user;
            if (email && password && phone && firstName) {
                const lowerCaseEmail = email.toLowerCase();
                const registrationUser = await this.userModel.findOne({
                    email: lowerCaseEmail,
                });
                if (registrationUser) {
                    throw new http_errors_1.Conflict(`User with ${email} in use`);
                }
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdUser = await this.userModel.create(Object.assign(Object.assign({}, user), { trial: true, trialEnds, paidEnds: trialEnds }));
                createdUser.setPassword(password);
                createdUser.save();
                await this.sendVerificationEmail(email);
                return await this.userModel
                    .findById(createdUser._id)
                    .select(parse_user_1.rows)
                    .exec();
            }
            else {
                throw new http_errors_1.BadRequest('Missing parameters');
            }
        }
        catch (e) {
            throw e;
        }
    }
    async checkTrialStatus(id) {
        try {
            const user = await this.userModel.findById(id).select('-password').exec();
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            if (user.trial && user.trialEnds > new Date()) {
                return true;
            }
            else {
                user.trial = false;
                await user.save();
                return false;
            }
        }
        catch (e) {
            throw e;
        }
    }
    async sendVerificationEmail(email) {
        try {
            const user = this.userModel.findOne({ email: email });
            const body = await (0, email_schemas_1.verifyEmailMsg)(user.id);
            const msg = {
                from: process.env.NOREPLY_MAIL,
                to: email,
                subject: 'Wechirka.com - підтведження реєстрації',
                html: body,
            };
            await this.transporter.sendMail(msg);
        }
        catch (error) {
            throw new Error('Failed to send verification email');
        }
    }
    async verifyUserEmail(id) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            await this.userModel.findByIdAndUpdate({ _id: id }, { verify: true });
        }
        catch (e) {
            throw e;
        }
    }
    async changePassword(req, newPass) {
        const user = await this.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const { oldPassword, password } = newPass;
            if (user.comparePassword(oldPassword) === true) {
                user.setPassword(password);
                await this.userModel.findByIdAndUpdate({ _id: user._id }, { password: user.password });
                const msg = {
                    to: user.email,
                    from: process.env.NOREPLY_MAIL,
                    subject: 'Зміна пароля',
                    html: `<div class="container">
          <h1>Ваш пароль було змінено на Wechirka.com</h1>
          <p>Натисніть на посіляння для переходу на сайт:</p>
          <p><a href="${process.env.FRONT_LINK}profile">Перейти у профіль</a></p>
      </div>`,
                };
                await this.transporter.sendMail(msg);
                return await this.userModel.findById(user._id).select(parse_user_1.rows).exec();
            }
            throw new http_errors_1.BadRequest('Password is not avaible');
        }
        catch (e) {
            throw e;
        }
    }
    async validateUser(details) {
        try {
            const user = await this.userModel.findOne({ email: details.email });
            if (user) {
                if (user.googleId === details.googleId) {
                    await this.checkTrialStatus(user._id);
                    await this.createToken(user);
                    return await this.userModel.findOne({ _id: user.id });
                }
                if (!user.googleId) {
                    await this.userModel.findByIdAndUpdate({ _id: user.id }, { googleId: details.googleId });
                    await this.checkTrialStatus(user._id);
                    await this.createToken(user);
                    return await this.userModel.findOne({ _id: user.id });
                }
            }
            if (!user) {
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdUser = await this.userModel.create(Object.assign(Object.assign({}, details), { trial: true, trialEnds, paidEnds: trialEnds }));
                createdUser.setPassword(details.password);
                createdUser.save();
                const userUpdateToken = await this.userModel.findOne({
                    email: details.email,
                });
                const newUser = await this.createToken(userUpdateToken);
                return newUser;
            }
        }
        catch (e) {
            throw new Error('Error validating user');
        }
    }
    async validateFacebook(details) {
        try {
            const user = await this.userModel.findOne({
                email: details.email,
            });
            if (user) {
                if (user.facebookId === details.facebookId) {
                    await this.checkTrialStatus(user._id);
                    const newUser = await this.createToken(user);
                    return newUser;
                }
                if (!user.facebookId) {
                    await this.userModel.findByIdAndUpdate({ _id: user.id }, { facebookId: details.facebookId });
                    await this.checkTrialStatus(user._id);
                    const newUser = await this.createToken(user);
                    return newUser;
                }
            }
            if (!user) {
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdUser = await this.userModel.create(Object.assign(Object.assign({}, details), { trial: true, trialEnds, paidEnds: trialEnds }));
                createdUser.setPassword(details.password);
                createdUser.save();
                const userUpdateToken = await this.userModel.findOne({
                    email: details.email,
                });
                await this.checkTrialStatus(user._id);
                const newUser = await this.createToken(userUpdateToken);
                return newUser;
            }
        }
        catch (e) {
            throw new Error('Error validating user');
        }
    }
    async restorePassword(email) {
        try {
            const restoreMail = await this.userModel.findOne(email);
            if (restoreMail) {
                function generatePassword() {
                    const length = 8;
                    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-';
                    let password = '';
                    for (let i = 0, n = charset.length; i < length; ++i) {
                        password += charset[Math.floor(Math.random() * n)];
                    }
                    return password;
                }
                const newPassword = generatePassword();
                restoreMail.setPassword(newPassword);
                await this.userModel.findByIdAndUpdate({ _id: restoreMail._id }, { password: restoreMail.password });
                const msg = {
                    to: restoreMail.email,
                    from: process.env.NOREPLY_MAIL,
                    subject: 'Відновлення пароля на Wechirka.com',
                    html: `<div class="container">
          <h1>Ваш пароль було змінено</h1>
          <p>Новий пароль для входу: ${newPassword}</p>
          <p>Натисніть на посіляння для переходу на сайт:</p>
          <p><a href="${process.env.FRONT_LINK}auth/login">Перейти за посиланням для в ходу</a></p>
      </div>`,
                };
                return await this.transporter.sendMail(msg);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest('User not found');
        }
    }
    async login(user) {
        try {
            const { email, password } = user;
            const lowerCaseEmail = email.toLowerCase();
            const authUser = await this.userModel.findOne({ email: lowerCaseEmail });
            if (!authUser || !authUser.comparePassword(password)) {
                throw new http_errors_1.Unauthorized(`Email or password is wrong`);
            }
            await this.checkTrialStatus(authUser._id);
            await this.createToken(authUser);
            return await this.userModel
                .findOne({ email: lowerCaseEmail })
                .select('-password')
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async logout(req) {
        const user = await this.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });
            return await this.userModel
                .findById({ _id: user.id })
                .select('-password')
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async deleteUserProfile(req, userPassword) {
        const user = await this.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const { password } = userPassword;
            if (user.comparePassword(password) === true) {
                await this.userModel.findByIdAndRemove({ _id: user._id });
                const msg = {
                    to: user.email,
                    from: process.env.NOREPLY_MAIL,
                    subject: 'Видалення профілю',
                    html: `<div class="container">
          <h1>Ваш профіль було видалено з ресурсу Wechirka.com</h1></div>`,
                };
                return await this.transporter.sendMail(msg);
            }
            throw new http_errors_1.BadRequest('Password is not avaible');
        }
        catch (e) {
            throw e;
        }
    }
    async updateUser(user, req) {
        try {
            const { firstName, social, title, description, phone, telegram, whatsapp, location, master_photo, video, price, viber, } = user;
            const findId = await this.findToken(req);
            if (!findId) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            if (firstName ||
                title ||
                description ||
                phone ||
                telegram ||
                whatsapp ||
                location ||
                master_photo ||
                video ||
                price ||
                social ||
                viber) {
                if (video) {
                    await this.userModel.findByIdAndUpdate({ _id: findId.id }, {
                        $push: { video: { $each: video, $slice: 5 } },
                    });
                    return await this.userModel
                        .findById({ _id: findId.id })
                        .select(parse_user_1.rows)
                        .exec();
                }
                if (social) {
                    const updatedSocial = Object.assign(Object.assign({}, findId.social), social);
                    const sanitizedSocial = Object.entries(updatedSocial)
                        .filter(([key, value]) => key && value)
                        .reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
                    await this.userModel.findByIdAndUpdate({ _id: findId.id }, { $set: { social: sanitizedSocial } });
                    return await this.userModel
                        .findById({ _id: findId.id })
                        .select(parse_user_1.rows)
                        .exec();
                }
                await this.userModel.findByIdAndUpdate({ _id: findId.id }, {
                    firstName,
                    title,
                    description,
                    phone,
                    telegram,
                    whatsapp,
                    location,
                    master_photo,
                    price,
                    viber,
                });
                return await this.userModel
                    .findById({ _id: findId.id })
                    .select(parse_user_1.rows)
                    .exec();
            }
        }
        catch (e) {
            throw e;
        }
    }
    async addSubcategory(categories, newCategory) {
        const updatedCategories = categories.map((category) => {
            if (category._id === newCategory._id) {
                category.subcategories = [
                    ...category.subcategories,
                    ...newCategory.subcategories,
                ];
            }
            return category;
        });
        if (!categories.some((category) => category._id === newCategory._id)) {
            updatedCategories.push(newCategory);
        }
        return updatedCategories;
    }
    async updateCategory(data, req) {
        try {
            const newCategory = data;
            const findId = await this.findToken(req);
            if (!findId) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const findUser = await this.userModel.findById(findId.id).exec();
            const arrCategory = findUser.category;
            const newCategoryArr = await this.addSubcategory(arrCategory, newCategory);
            await this.userModel.updateOne({ _id: findId.id }, {
                $set: { category: newCategoryArr },
            });
            return await this.userModel
                .findById({ _id: findId.id })
                .select(parse_user_1.rows)
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async deleteCategory(id, req) {
        try {
            const user = await this.findToken(req);
            if (!user) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const updatedCategories = user.category
                .map((category) => {
                if (category._id === id) {
                    return undefined;
                }
                else {
                    category.subcategories = category.subcategories.filter((subcat) => subcat.id !== id);
                    return category;
                }
            })
                .filter(Boolean);
            await this.userModel.updateOne({ _id: user.id }, {
                $set: { category: updatedCategories },
            });
            return await this.userModel
                .findById({ _id: user.id })
                .select(parse_user_1.rows)
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async deleteUserVideo(id, req) {
        const user = await this.findToken(req);
        if (!user) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const videoArray = user.video;
            const newArr = videoArray.filter((video) => video.publicId !== id);
            await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                $set: { video: newArr },
            });
            return await this.userModel
                .findById({ _id: user.id })
                .select(parse_user_1.rows)
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async findToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            else {
                const SECRET_KEY = process.env.SECRET_KEY;
                const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
                const user = await this.userModel.findById({ _id: findId.id }).exec();
                return user;
            }
        }
        catch (e) {
            if (e.message === 'jwt expired') {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            else {
                throw e;
            }
        }
    }
    async createToken(authUser) {
        try {
            const payload = {
                id: authUser._id,
            };
            const SECRET_KEY = process.env.SECRET_KEY;
            const token = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '1m' });
            const refreshToken = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY);
            const authentificationUser = await this.userModel
                .findById({
                _id: authUser._id,
            })
                .select('-password')
                .exec();
            if (authentificationUser.refresh_token !== null) {
                await this.userModel.findByIdAndUpdate(authUser._id, {
                    token: token,
                });
                return await this.userModel
                    .findById({
                    _id: authUser._id,
                })
                    .select('-password')
                    .exec();
            }
            else {
                await this.userModel.findByIdAndUpdate(authUser._id, {
                    token: token,
                    refresh_token: refreshToken,
                });
                return await this.userModel
                    .findById({
                    _id: authUser._id,
                })
                    .select('-password')
                    .exec();
            }
        }
        catch (e) {
            throw e;
        }
    }
    async refreshAccessToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const user = await this.userModel.findOne({
                refresh_token: token,
            });
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            const payload = {
                id: user._id,
            };
            const tokenRef = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '24h' });
            await this.userModel.findByIdAndUpdate(user._id, { token: tokenRef });
            const authentificationUser = await this.userModel
                .findById({
                _id: user.id,
            })
                .select('-password')
                .exec();
            return authentificationUser;
        }
        catch (e) {
            throw e;
        }
    }
    async findCategory() {
        try {
            const find = await this.categoryModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_model_1.Category.name)),
    __param(2, (0, common_1.Inject)(exports.TRANSPORTER_PROVIDER)),
    __metadata("design:paramtypes", [users_model_1.User,
        category_model_1.Category, Object])
], UsersService);
users_model_1.UserSchema.methods.setPassword = async function (password) {
    return (this.password = (0, bcryptjs_1.hashSync)(password, 10));
};
users_model_1.UserSchema.methods.setName = function (email) {
    const parts = email.split('@');
    this.firstName = parts[0];
};
users_model_1.UserSchema.methods.comparePassword = function (password) {
    return (0, bcryptjs_1.compareSync)(password, this.password);
};
//# sourceMappingURL=users.service.js.map