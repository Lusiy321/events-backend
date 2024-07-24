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
exports.PlacesService = exports.TRANSPORTER_PROVIDER = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcryptjs_1 = require("bcryptjs");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
const email_schemas_1 = require("../users/utils/emails/email.schemas");
const parse_user_1 = require("../users/utils/parse.user");
const nodemailer = require("nodemailer");
const email_changePassword_1 = require("../users/utils/emails/email.changePassword");
const email_restorePassword_1 = require("../users/utils/emails/email.restorePassword");
const cloudinary_service_1 = require("../users/cloudinary.service");
const email_delete_1 = require("../users/utils/emails/email.delete");
const places_model_1 = require("./places.model");
const category_place_model_1 = require("./category.place.model");
exports.TRANSPORTER_PROVIDER = 'TRANSPORTER_PROVIDER';
let PlacesService = class PlacesService {
    constructor(placeModel, categoryModel, transporter, cloudinaryService) {
        this.placeModel = placeModel;
        this.categoryModel = categoryModel;
        this.transporter = transporter;
        this.cloudinaryService = cloudinaryService;
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
    async findAllPlaces() {
        try {
            const find = await this.placeModel.find().select(parse_user_1.placeRows);
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Place not found');
        }
    }
    async findById(id) {
        try {
            const find = await this.placeModel
                .findById(id)
                .select('-password')
                .exec();
            await this.checkTrialStatus(id);
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Place not found');
        }
    }
    async create(place) {
        try {
            const { email, password, phone, placeName } = place;
            if (email && password && phone && placeName) {
                const lowerCaseEmail = email.toLowerCase();
                const registrationUser = await this.placeModel.findOne({
                    email: lowerCaseEmail,
                });
                if (registrationUser) {
                    throw new http_errors_1.Conflict(`User with ${email} in use`);
                }
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdPlace = await this.placeModel.create(Object.assign(Object.assign({}, place), { trial: true, trialEnds, paidEnds: trialEnds }));
                createdPlace.setPassword(password);
                createdPlace.save();
                await this.createToken(createdPlace);
                await this.sendVerificationEmail(email);
                return await this.placeModel
                    .findById(createdPlace._id)
                    .select(parse_user_1.placeRows)
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
            const place = await this.placeModel
                .findById(id)
                .select('-password')
                .exec();
            if (!place) {
                throw new http_errors_1.NotFound('User not found');
            }
            if (place.trial && place.trialEnds > new Date()) {
                return true;
            }
            else {
                place.trial = false;
                await place.save();
                return false;
            }
        }
        catch (e) {
            throw e;
        }
    }
    async sendVerificationEmail(email) {
        try {
            const place = await this.placeModel.findOne({ email: email });
            const body = await (0, email_schemas_1.verifyEmailMsg)(place.id);
            const msg = {
                from: process.env.NOREPLY_MAIL,
                to: email,
                subject: 'Wechirka.com - підтведження реєстрації',
                html: body,
            };
            await this.transporter.sendMail(msg);
            return place;
        }
        catch (error) {
            throw new Error('Failed to send verification email');
        }
    }
    async verifyPlaceEmail(id) {
        try {
            const place = await this.placeModel.findById(id);
            if (!place) {
                throw new http_errors_1.NotFound('User not found');
            }
            await this.placeModel.findByIdAndUpdate({ _id: id }, { verify: true });
            return await this.placeModel.findById(id);
        }
        catch (e) {
            throw e;
        }
    }
    async changePassword(req, newPass) {
        const place = await this.findToken(req);
        if (!place) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const { oldPassword, password } = newPass;
            if (place.comparePassword(oldPassword) === true) {
                place.setPassword(password);
                await this.placeModel.findByIdAndUpdate({ _id: place._id }, { password: place.password });
                const body = await (0, email_changePassword_1.changePasswordEmailMsg)();
                const msg = {
                    to: place.email,
                    from: process.env.NOREPLY_MAIL,
                    subject: 'Зміна пароля',
                    html: body,
                };
                await this.transporter.sendMail(msg);
                return await this.placeModel
                    .findById(place._id)
                    .select(parse_user_1.placeRows)
                    .exec();
            }
            throw new http_errors_1.BadRequest('Password is not avaible');
        }
        catch (e) {
            throw e;
        }
    }
    async validatePlace(details) {
        try {
            const place = await this.placeModel.findOne({ email: details.email });
            if (place) {
                if (place.googleId === details.googleId) {
                    await this.checkTrialStatus(place._id);
                    await this.createToken(place);
                    return await this.placeModel.findOne({ _id: place.id });
                }
                if (!place.googleId) {
                    await this.placeModel.findByIdAndUpdate({ _id: place.id }, { googleId: details.googleId });
                    await this.checkTrialStatus(place._id);
                    await this.createToken(place);
                    return await this.placeModel.findOne({ _id: place.id });
                }
            }
            if (!place) {
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdPlace = await this.placeModel.create(Object.assign(Object.assign({}, details), { trial: true, verify: true, trialEnds, paidEnds: trialEnds }));
                createdPlace.setPassword(details.password);
                createdPlace.save();
                const placeUpdateToken = await this.placeModel.findOne({
                    email: details.email,
                });
                await this.sendVerificationEmail(details.email);
                const newPlace = await this.createToken(placeUpdateToken);
                return newPlace;
            }
        }
        catch (e) {
            throw new Error('Error validating user');
        }
    }
    async validateFacebook(details) {
        try {
            const place = await this.placeModel.findOne({
                email: details.email,
            });
            if (place) {
                if (place.facebookId === details.facebookId) {
                    await this.checkTrialStatus(place._id);
                    const newPlace = await this.createToken(place);
                    return newPlace;
                }
                if (!place.facebookId) {
                    await this.placeModel.findByIdAndUpdate({ _id: place.id }, { facebookId: details.facebookId });
                    await this.checkTrialStatus(place._id);
                    const newPlace = await this.createToken(place);
                    return newPlace;
                }
            }
            if (!place) {
                const trialEnds = new Date();
                trialEnds.setMonth(trialEnds.getMonth() + 2);
                const createdPlace = await this.placeModel.create(Object.assign(Object.assign({}, details), { trial: true, trialEnds, verify: true, paidEnds: trialEnds }));
                createdPlace.setPassword(details.password);
                createdPlace.save();
                const placeUpdateToken = await this.placeModel.findOne({
                    email: details.email,
                });
                await this.sendVerificationEmail(details.email);
                const newPlace = await this.createToken(placeUpdateToken);
                return newPlace;
            }
        }
        catch (e) {
            throw new Error('Error validating place');
        }
    }
    async restorePassword(email) {
        try {
            const restoreMail = await this.placeModel.findOne(email);
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
                await this.placeModel.findByIdAndUpdate({ _id: restoreMail._id }, { password: restoreMail.password });
                const body = await (0, email_restorePassword_1.restorePasswordEmailMsg)(newPassword);
                const msg = {
                    to: restoreMail.email,
                    from: process.env.NOREPLY_MAIL,
                    subject: 'Відновлення пароля на Wechirka.com',
                    html: body,
                };
                return await this.transporter.sendMail(msg);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest('User not found');
        }
    }
    async login(place) {
        try {
            const { email, password } = place;
            const lowerCaseEmail = email.toLowerCase();
            const authPlace = await this.placeModel.findOne({
                email: lowerCaseEmail,
            });
            if (!authPlace || !authPlace.comparePassword(password)) {
                throw new http_errors_1.Unauthorized(`Email or password is wrong`);
            }
            if (authPlace.verify === false) {
                throw new http_errors_1.NotAcceptable(`Email not verify`);
            }
            await this.checkTrialStatus(authPlace._id);
            await this.createToken(authPlace);
            return await this.placeModel
                .findOne({ email: lowerCaseEmail })
                .select('-password')
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async logout(req) {
        const place = await this.findToken(req);
        if (!place) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            await this.placeModel.findByIdAndUpdate({ _id: place.id }, { token: null });
            return await this.placeModel
                .findById({ _id: place.id })
                .select('-password')
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async deletePlaceProfile(req, placePassword) {
        try {
            const place = await this.findToken(req);
            if (!place) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const { password } = placePassword;
            if (place.comparePassword(password) === true) {
                await this.cloudinaryService.deleteAllPlaceImages(place);
                await this.placeModel.findByIdAndRemove({ _id: place._id });
                const body = email_delete_1.delUserMsg;
                const msg = {
                    to: place.email,
                    from: process.env.NOREPLY_MAIL,
                    subject: 'Видалення профілю',
                    html: body,
                };
                await this.transporter.sendMail(msg);
                return place;
            }
            throw new http_errors_1.BadRequest('Password is not avaible');
        }
        catch (e) {
            throw e;
        }
    }
    async updatePlace(place, req) {
        try {
            const { placeName, social, title, description, phone, telegram, whatsapp, location, master_photo, video, price, viber, register, } = place;
            const findId = await this.findToken(req);
            if (!findId) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            if (placeName ||
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
                viber ||
                register) {
                if (video) {
                    await this.placeModel.findByIdAndUpdate({ _id: findId.id }, {
                        $push: { video: { $each: video, $slice: 5 } },
                    });
                    return await this.placeModel
                        .findById({ _id: findId.id })
                        .select(parse_user_1.placeRows)
                        .exec();
                }
                if (social) {
                    const updatedSocial = Object.assign(Object.assign({}, findId.social), social);
                    const sanitizedSocial = Object.entries(updatedSocial)
                        .filter(([key, value]) => key && value)
                        .reduce((acc, [key, value]) => (Object.assign(Object.assign({}, acc), { [key]: value })), {});
                    await this.placeModel.findByIdAndUpdate({ _id: findId.id }, { $set: { social: sanitizedSocial } });
                    return await this.placeModel
                        .findById({ _id: findId.id })
                        .select(parse_user_1.placeRows)
                        .exec();
                }
                await this.placeModel.findByIdAndUpdate({ _id: findId.id }, {
                    placeName,
                    title,
                    description,
                    phone,
                    telegram,
                    whatsapp,
                    location,
                    master_photo,
                    price,
                    viber,
                    register,
                });
                return await this.placeModel
                    .findById({ _id: findId.id })
                    .select(parse_user_1.placeRows)
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
            const findUser = await this.placeModel.findById(findId.id).exec();
            const arrCategory = findUser.category;
            const newCategoryArr = await this.addSubcategory(arrCategory, newCategory);
            await this.placeModel.updateOne({ _id: findId.id }, {
                $set: { category: newCategoryArr },
            });
            return await this.placeModel
                .findById({ _id: findId.id })
                .select(parse_user_1.placeRows)
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async deleteCategory(id, req) {
        try {
            const place = await this.findToken(req);
            if (!place) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const updatedCategories = place.category
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
            await this.placeModel.updateOne({ _id: place.id }, {
                $set: { category: updatedCategories },
            });
            return await this.placeModel
                .findById({ _id: place.id })
                .select(parse_user_1.placeRows)
                .exec();
        }
        catch (e) {
            throw e;
        }
    }
    async deletePlaceVideo(id, req) {
        const place = await this.findToken(req);
        if (!place) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            const videoArray = place.video;
            const newArr = videoArray.filter((video) => video.publicId !== id);
            await this.placeModel.findByIdAndUpdate({ _id: place.id }, {
                $set: { video: newArr },
            });
            return await this.placeModel
                .findById({ _id: place.id })
                .select(parse_user_1.placeRows)
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
                const place = await this.placeModel.findById({ _id: findId.id }).exec();
                return place;
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
    async createToken(authPlace) {
        try {
            const payload = {
                id: authPlace._id,
            };
            const SECRET_KEY = process.env.SECRET_KEY;
            const token = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '1m' });
            const refreshToken = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY);
            const authentificationPlace = await this.placeModel
                .findById({
                _id: authPlace._id,
            })
                .select('-password')
                .exec();
            if (authentificationPlace.refresh_token !== null) {
                await this.placeModel.findByIdAndUpdate(authPlace._id, {
                    token: token,
                });
                return await this.placeModel
                    .findById({
                    _id: authPlace._id,
                })
                    .select('-password')
                    .exec();
            }
            else {
                await this.placeModel.findByIdAndUpdate(authPlace._id, {
                    token: token,
                    refresh_token: refreshToken,
                });
                return await this.placeModel
                    .findById({
                    _id: authPlace._id,
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
            const place = await this.placeModel.findOne({
                refresh_token: token,
            });
            if (!place) {
                throw new http_errors_1.NotFound('Place not found');
            }
            const payload = {
                id: place._id,
            };
            const tokenRef = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '24h' });
            await this.placeModel.findByIdAndUpdate(place._id, { token: tokenRef });
            const authentificationPlace = await this.placeModel
                .findById({
                _id: place.id,
            })
                .select('-password')
                .exec();
            return authentificationPlace;
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
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(places_model_1.Place.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_place_model_1.CategoryPlace.name)),
    __param(2, (0, common_1.Inject)(exports.TRANSPORTER_PROVIDER)),
    __metadata("design:paramtypes", [places_model_1.Place,
        category_place_model_1.CategoryPlace, Object, cloudinary_service_1.CloudinaryService])
], PlacesService);
places_model_1.PlaceSchema.methods.setPassword = async function (password) {
    return (this.password = (0, bcryptjs_1.hashSync)(password, 10));
};
places_model_1.PlaceSchema.methods.setName = function (email) {
    const parts = email.split('@');
    this.firstName = parts[0];
};
places_model_1.PlaceSchema.methods.comparePassword = function (password) {
    return (0, bcryptjs_1.compareSync)(password, this.password);
};
//# sourceMappingURL=places.service.js.map