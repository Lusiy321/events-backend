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
const uuid_1 = require("uuid");
const email_schemas_1 = require("./utils/email.schemas");
let UsersService = class UsersService {
    constructor(userModel, categoryModel) {
        this.userModel = userModel;
        this.categoryModel = categoryModel;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    async searchUsers(query) {
        const { req, loc } = query;
        try {
            const searchItem = req;
            const regexReq = new RegExp(searchItem, 'i');
            const regexLoc = new RegExp(loc, 'i');
            if (searchItem === '' && loc === '') {
                return this.userModel.find(req).exec();
            }
            if (req !== '' && loc === '') {
                const findTitle = await this.userModel
                    .find({
                    title: { $regex: regexReq },
                })
                    .exec();
                const findCat = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                })
                    .exec();
                const findSubcat = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                })
                    .exec();
                const findDescr = await this.userModel
                    .find({
                    description: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .exec();
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: req,
                        },
                    },
                })
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: req,
                        },
                    },
                })
                    .exec();
                function mergeAndRemoveDuplicates(...arrays) {
                    const mergedArray = [].concat(...arrays);
                    const uniqueArray = Array.from(new Set(mergedArray));
                    return uniqueArray;
                }
                const resultArray = mergeAndRemoveDuplicates(findTitle, findDescr, category, subcategory, findCat, findSubcat);
                return resultArray;
            }
            else if (req === '' && loc !== '') {
                const findLocation = await this.userModel
                    .find({
                    location: { $regex: regexLoc },
                })
                    .exec();
                return findLocation;
            }
            else if (req !== '' && loc !== '') {
                const findTitle = await this.userModel
                    .find({
                    title: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .exec();
                const findDescr = await this.userModel
                    .find({
                    description: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .exec();
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: req,
                        },
                    },
                    location: { $regex: regexLoc },
                })
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: req,
                        },
                    },
                    location: { $regex: regexLoc },
                })
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
                    .exec();
                function mergeAndRemoveDuplicates(...arrays) {
                    const mergedArray = [].concat(...arrays);
                    const uniqueArray = Array.from(new Set(mergedArray));
                    return uniqueArray;
                }
                const resultArray = mergeAndRemoveDuplicates(findTitle, findDescr, category, subcategory, findCat, findSubcat);
                return resultArray;
            }
            else {
                throw new http_errors_1.NotFound('Post not found');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('Post not found');
        }
    }
    async findAllUsers() {
        try {
            const find = await this.userModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findById(id) {
        try {
            const find = await this.userModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async create(user) {
        try {
            const { email } = user;
            const lowerCaseEmail = email.toLowerCase();
            const registrationUser = await this.userModel.findOne({
                email: lowerCaseEmail,
            });
            if (registrationUser) {
                throw new http_errors_1.Conflict(`User with ${email} in use`);
            }
            const createdUser = await this.userModel.create(user);
            createdUser.setName(lowerCaseEmail);
            createdUser.setPassword(user.password);
            createdUser.save();
            return await this.userModel.findById(createdUser._id);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
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
          <p><a href="${process.env.FRONT_LINK}/profile">Go to your account</a></p>
      </div>`,
                };
                await sgMail.send(msg);
                return await this.userModel.findById(user._id);
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
            if (user === null) {
                const newUser = await this.userModel.create(details);
                newUser.save();
                const userUpdateToken = await this.userModel.findOne({
                    email: details.email,
                });
                await this.userModel.createToken(userUpdateToken);
                return await this.userModel.findById({
                    _id: userUpdateToken._id,
                });
            }
            await this.userModel.createToken(user);
            return await this.userModel.findOne({
                _id: user.id,
            });
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
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
            await this.createToken(authUser);
            return await this.userModel.findOne({ email: lowerCaseEmail });
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
            return await this.userModel.findById({ _id: user.id });
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async update(user, req) {
        const { firstName, lastName, title, description, phone, telegram, viber, whatsapp, location, master_photo, video, category, price, } = user;
        const findId = await this.findToken(req);
        if (!findId) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (firstName ||
                lastName ||
                title ||
                description ||
                phone ||
                telegram ||
                viber ||
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
                    lastName,
                    title,
                    description,
                    phone,
                    telegram,
                    viber,
                    whatsapp,
                    location,
                    master_photo,
                    price,
                });
                const userUpdate = this.userModel.findById({ _id: findId.id });
                return userUpdate;
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
            return await this.userModel.findById({ _id: user.id });
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
                const user = await this.userModel.findById({ _id: findId.id });
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
        const authentificationUser = await this.userModel.findById({
            _id: authUser._id,
        });
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
            const authentificationUser = await this.userModel.findById({
                _id: user.id,
            });
            return authentificationUser;
        }
        catch (error) {
            throw new http_errors_1.BadRequest('Invalid refresh token');
        }
    }
    async createCategory(category) {
        try {
            const { name } = category;
            const lowerCaseEmail = name.toLowerCase();
            const registrationCategory = await this.categoryModel.findOne({
                name: lowerCaseEmail,
            });
            if (registrationCategory) {
                throw new http_errors_1.Conflict(`Category ${name} exist`);
            }
            const createdCategory = await this.categoryModel.create(category);
            createdCategory.save();
            return await this.categoryModel.findById(createdCategory._id);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async addUsercategory(userID, categoryID, subcategoryID) {
        try {
            const findUser = await this.userModel.findById(userID).exec();
            const arrCategory = findUser.category;
            const findCategory = await this.categoryModel.findById(categoryID).exec();
            const arrSubcategory = findCategory.subcategories;
            function searchById(arr, id) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id === id) {
                        return arr[i];
                    }
                }
                return null;
            }
            const result = searchById(arrSubcategory, subcategoryID);
            findCategory.subcategories = [];
            findCategory.subcategories.push(result);
            arrCategory.push(findCategory);
            await this.userModel.updateOne({ _id: userID }, { $set: { category: arrCategory } });
            return await this.userModel.findById(userID);
        }
        catch (e) {
            throw new http_errors_1.NotFound('Category not found');
        }
    }
    async addSubcategory(catId, subCategory) {
        try {
            const find = await this.categoryModel.findById(catId).exec();
            const arr = find.subcategories;
            subCategory.id = (0, uuid_1.v4)();
            arr.push(subCategory);
            await this.categoryModel.updateOne({ _id: catId }, { $set: { subcategories: arr } });
            return await this.categoryModel.findById(catId);
        }
        catch (e) {
            throw new http_errors_1.NotFound('Category not found');
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
    async findUserCategory(id) {
        try {
            const find = await this.userModel.find({ 'category._id': id }).exec();
            if (Array.isArray(find) && find.length === 0) {
                return new http_errors_1.NotFound('User not found');
            }
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findUserSubcategory(id) {
        try {
            const find = await this.userModel
                .find({ 'category.subcategories.id': id })
                .exec();
            if (Array.isArray(find) && find.length === 0) {
                return new http_errors_1.NotFound('User not found');
            }
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