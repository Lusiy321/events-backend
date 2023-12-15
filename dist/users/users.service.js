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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
const bcrypt_1 = require("bcrypt");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const category_model_1 = require("./category.model");
const email_schemas_1 = require("./utils/email.schemas");
const parse_user_1 = require("./utils/parse.user");
let UsersService = class UsersService {
    constructor(userModel, categoryModel) {
        this.userModel = userModel;
        this.categoryModel = categoryModel;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
                const createdUser = await this.userModel.create(Object.assign(Object.assign({}, user), { trial: true, trialEnds }));
                createdUser.setName(lowerCaseEmail);
                createdUser.setPassword(password);
                createdUser.save();
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
        const body = await (0, email_schemas_1.verifyEmailMsg)(verificationLink);
        const msg = {
            to: email,
            from: 'lusiy321@gmail.com',
            subject: 'Підтвердження e-mail Wechirka.com',
            html: body,
        };
        try {
            await sgMail.send(msg);
        }
        catch (error) {
            throw new Error('Failed to send verification email');
        }
    }
    async verifyUserEmail(id) {
        try {
            const user = await this.userModel.findById(id);
            user.verify = true;
            user.save();
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
                user.save();
                const msg = {
                    to: user.email,
                    from: 'lusiy321@gmail.com',
                    subject: 'Your password has been changed on swep.com',
                    html: `<div class="container">
          <h1>Your Password Has Been Changed</h1>
          <p>Click on the link below to go to your personal account:</p>
          <p><a href="${process.env.FRONT_LINK}/auth/login">Go to your account</a></p>
      </div>`,
                };
                await sgMail.send(msg);
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
                await this.userModel.create(details);
                const userUpdateToken = await this.userModel.findOne({
                    email: details.email,
                });
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
                const msg = {
                    to: restoreMail.email,
                    from: 'lusiy321@gmail.com',
                    subject: 'Change your password on swep.com',
                    html: `<div class="container">
          <h1>Your Password Has Been Changed</h1>
          <p>Click on the link below to go to your personal account:</p>
          <p><a href="${process.env.FRONT_LINK}profile">Go to your account</a></p>
      </div>`,
                };
                return await sgMail.send(msg);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest('User not found');
        }
    }
    async updateRestorePassword(id, newPass) {
        const user = await this.userModel.findById(id);
        const { password } = newPass;
        try {
            if (user) {
                user.setPassword(password);
                user.save();
                const msg = {
                    to: user.email,
                    from: 'lusiy321@gmail.com',
                    subject: 'Your password has been changed on swep.com',
                    html: `<div class="container">
          <h1>Your Password Has Been Changed</h1>
          <p>Click on the link below to go to your personal account:</p>
          <p><a href="${process.env.FRONT_LINK}profile"> Go to your account </a></p>
      </div>`,
                };
                await sgMail.send(msg);
                return await this.userModel.findById(user._id);
            }
            throw new http_errors_1.BadRequest('User not found');
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
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
        const { firstName, title, description, phone, telegram, whatsapp, location, master_photo, video, category, price, } = user;
        const findId = await this.findToken(req);
        if (!findId) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (firstName ||
                title ||
                description ||
                phone ||
                telegram ||
                whatsapp ||
                location ||
                master_photo ||
                video ||
                category ||
                price) {
                if (category) {
                    const findUser = await this.userModel.findById(findId.id).exec();
                    const arrCategory = findUser.category;
                    function addSubcategory(categories, categoryId, newSubcategory, newCategory) {
                        if (Array.isArray(categories) && categories.length === 0) {
                            categories.push(...newCategory);
                            return categories;
                        }
                        const updatedCategories = categories.map((category) => {
                            if (category._id === categoryId) {
                                const existingSubcategory = category.subcategories.find((sub) => sub.id === newSubcategory.id);
                                if (existingSubcategory) {
                                    return category;
                                }
                                return Object.assign(Object.assign({}, category), { subcategories: [...category.subcategories, newSubcategory] });
                            }
                            else if (category._id !== categoryId) {
                                categories.push(...newCategory);
                                return categories;
                            }
                        });
                        return updatedCategories;
                    }
                    const newCategoryArr = addSubcategory(arrCategory, category[0]._id, category[0].subcategories[0], category);
                    await this.userModel.findByIdAndUpdate({ _id: findId.id }, {
                        $set: { category: newCategoryArr },
                    });
                    return await this.userModel.findById({ _id: findId.id });
                }
                if (video) {
                    const findUser = await this.userModel.findById(findId.id).exec();
                    const arrVideo = findUser.video;
                    if (arrVideo.length <= 4) {
                        arrVideo.push(...video);
                        await this.userModel.findByIdAndUpdate({ _id: findId.id }, {
                            $set: { video: arrVideo },
                        });
                        return await this.userModel.findById({ _id: findId.id });
                    }
                    else {
                        throw new http_errors_1.NotFound('To many videos');
                    }
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
                const user = await this.userModel
                    .findById({ _id: findId.id })
                    .select('-password')
                    .exec();
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_model_1.Category.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        category_model_1.Category])
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