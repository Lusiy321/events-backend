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
const bcrypt_1 = require("bcrypt");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const category_model_1 = require("./category.model");
const email_schemas_1 = require("./utils/email.schemas");
const parse_user_1 = require("./utils/parse.user");
const crypto = require("crypto");
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
    async searchUsers(query) {
        const { req, loc, page, cat, subcat } = query;
        try {
            const curentPage = page || 1;
            const limit = 8;
            const totalCount = await this.userModel.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            const offset = (curentPage - 1) * limit;
            if (!req && !loc && !cat && !subcat) {
                const result = await this.userModel
                    .find()
                    .select(parse_user_1.rows)
                    .skip(offset)
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .exec();
                return {
                    totalPages: totalPages,
                    currentPage: curentPage,
                    data: result,
                };
            }
            const regexReq = new RegExp(req, 'i');
            const regexLoc = new RegExp(loc, 'i');
            if ((req === '' && loc === '') ||
                (!req && !loc) ||
                (cat && !subcat) ||
                (!cat && subcat)) {
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = (0, parse_user_1.mergeAndRemoveDuplicates)(category, subcategory);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Users not found');
                }
                else {
                    const result = (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / limit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            if ((req !== '' && loc === '') || !loc) {
                const findTitle = await this.userModel
                    .find({
                    title: { $regex: regexReq },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findCat = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findSubcat = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findDescr = await this.userModel
                    .find({
                    description: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findLocation = await this.userModel
                    .find({
                    location: { $regex: regexReq },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findName = await this.userModel
                    .find({
                    firstName: { $regex: regexReq },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = (0, parse_user_1.mergeAndRemoveDuplicates)(findTitle, findDescr, category, subcategory, findCat, findSubcat, findLocation, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Users not found');
                }
                else {
                    const result = (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / limit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            else if ((req === '' && loc !== '') || !req) {
                const findLocation = await this.userModel
                    .find({
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .skip(offset)
                    .limit(limit)
                    .exec();
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = (0, parse_user_1.mergeAndRemoveDuplicates)(category, subcategory, findLocation);
                if (Array.isArray(resultArray) && findLocation.length === 0) {
                    throw new http_errors_1.NotFound('User not found');
                }
                else {
                    const result = (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / limit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            else if (req !== '' && loc !== '') {
                const findTitle = await this.userModel
                    .find({
                    title: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findDescr = await this.userModel
                    .find({
                    description: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findCat = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findSubcat = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findName = await this.userModel
                    .find({
                    firstName: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = (0, parse_user_1.mergeAndRemoveDuplicates)(findTitle, findDescr, category, subcategory, findCat, findSubcat, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('User not found');
                }
                else {
                    const result = (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / limit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
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
                createdUser.setName(lowerCaseEmail);
                createdUser.setPassword(password);
                createdUser.save();
                const verificationLink = `${process.env.BACK_LINK}verify-email/${createdUser._id}`;
                await this.sendVerificationEmail(email, verificationLink);
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
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async checkTrialStatus(id) {
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
    async sendVerificationEmail(email, verificationLink) {
        try {
            const body = await (0, email_schemas_1.verifyEmailMsg)(verificationLink);
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
            throw new http_errors_1.BadRequest(e.message);
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
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async validateUser(details) {
        const user = await this.userModel.findOne({ googleId: details.googleId });
        try {
            if (!user) {
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdUser = await this.userModel.create(Object.assign(Object.assign({}, details), { trial: true, trialEnds, paidEnds: trialEnds }));
                createdUser.setPassword(details.password);
                createdUser.save();
                const userUpdateToken = await this.userModel.findOne({
                    email: details.email,
                });
                await this.createToken(userUpdateToken);
                return await this.userModel.findById({ _id: userUpdateToken._id });
            }
            await this.checkTrialStatus(user._id);
            await this.createToken(user);
            return await this.userModel.findOne({ _id: user.id });
        }
        catch (e) {
            throw new Error('Error validating user');
        }
    }
    async validateFacebook(details) {
        const user = await this.userModel.findOne({
            facebookId: details.facebookId,
        });
        try {
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
                await this.createToken(userUpdateToken);
                return await this.userModel.findById({ _id: userUpdateToken._id });
            }
            await this.createToken(user);
            return await this.userModel.findOne({ _id: user.id });
        }
        catch (e) {
            throw new Error('Error validating user');
        }
    }
    async restorePassword(email) {
        const restoreMail = await this.userModel.findOne(email);
        try {
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
            throw new http_errors_1.BadRequest(e.message);
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
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async update(user, req) {
        try {
            const { firstName, social, title, description, phone, telegram, whatsapp, location, master_photo, video, price, } = user;
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
                social) {
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
                });
                return await this.userModel
                    .findById({ _id: findId.id })
                    .select(parse_user_1.rows)
                    .exec();
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async updateCategory(data, req) {
        try {
            const category = [data];
            const findId = await this.findToken(req);
            if (!findId) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const findUser = await this.userModel.findById(findId.id).exec();
            const arrCategory = findUser.category;
            function addSubcategory(categories, newCategory) {
                const idSet = new Set(categories.map((obj) => obj._id));
                newCategory.forEach((obj) => {
                    idSet.add(obj._id);
                });
                return Array.from(idSet).map((id) => newCategory.find((obj) => obj._id === id));
            }
            const newCategoryArr = addSubcategory(arrCategory, category);
            await this.userModel.updateOne({ _id: findId.id }, {
                $set: { category: newCategoryArr },
            });
            return await this.userModel
                .findById({ _id: findId.id })
                .select(parse_user_1.rows)
                .exec();
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
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
            throw new http_errors_1.BadRequest(e.message);
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
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async findOrCreateUser(googleId, firstName, email) {
        try {
            let user = await this.userModel.findOne({ googleId });
            if (!user) {
                user = await this.userModel.create({
                    googleId,
                    firstName,
                    email,
                });
                user.setPassword(googleId);
                return user.save();
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
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
            throw new http_errors_1.Unauthorized('jwt expired');
        }
    }
    async createToken(authUser) {
        const payload = {
            id: authUser._id,
        };
        const SECRET_KEY = process.env.SECRET_KEY;
        const token = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '10m' });
        await this.userModel.findByIdAndUpdate(authUser._id, { token });
        const authentificationUser = await this.userModel
            .findById({
            _id: authUser._id,
        })
            .select('-password')
            .exec();
        return authentificationUser;
    }
    async refreshAccessToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            const SECRET_KEY = process.env.SECRET_KEY;
            const user = await this.userModel.findOne({ token: token });
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
        catch (error) {
            throw new http_errors_1.BadRequest('Invalid refresh token');
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
    async monoPayment(amount) {
        const privateKey = 'ufV_RSdULOS - VD7HnIJGQCVCxdsn1VsPn6x6WgS5DfzM';
        let pubKeyBase64 = 'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFQUc1LzZ3NnZubGJZb0ZmRHlYWE4vS29CbVVjTgo3NWJSUWg4MFBhaEdldnJoanFCQnI3OXNSS0JSbnpHODFUZVQ5OEFOakU1c0R3RmZ5Znhub0ZJcmZBPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==';
        let xSignBase64 = 'MEUCIQC/mVKhi8FKoayul2Mim3E2oaIOCNJk5dEXxTqbkeJSOQIgOM0hsW0qcP2H8iXy1aQYpmY0SJWEaWur7nQXlKDCFxA=';
        let message = `{
    "invoiceId": "p2_9ZgpZVsl3",
    "status": "created",
    "failureReason": "string",
    "amount": 4200,
    "ccy": 980,
    "finalAmount": 4200,
    "createdDate": "2019-08-24T14:15:22Z",
    "modifiedDate": "2019-08-24T14:15:22Z",
    "reference": "84d0070ee4e44667b31371d8f8813947",
    "cancelList": [
      {
        "status": "processing",
        "amount": 4200,
        "ccy": 980,
        "createdDate": "2019-08-24T14:15:22Z",
        "modifiedDate": "2019-08-24T14:15:22Z",
        "approvalCode": "662476",
        "rrn": "060189181768",
        "extRef": "635ace02599849e981b2cd7a65f417fe"
      }
    ]
  }`;
        let signatureBuf = Buffer.from(xSignBase64, 'base64');
        let publicKeyBuf = Buffer.from(pubKeyBase64, 'base64');
        let verify = crypto.createVerify('SHA256');
        verify.write(message);
        verify.end();
        let result = verify.verify(publicKeyBuf, signatureBuf);
        console.log(result === true ? 'OK' : 'NOT OK');
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
    return (this.password = (0, bcrypt_1.hashSync)(password, 10));
};
users_model_1.UserSchema.methods.setName = function (email) {
    const parts = email.split('@');
    this.firstName = parts[0];
};
users_model_1.UserSchema.methods.comparePassword = function (password) {
    return (0, bcrypt_1.compareSync)(password, this.password);
};
//# sourceMappingURL=users.service.js.map