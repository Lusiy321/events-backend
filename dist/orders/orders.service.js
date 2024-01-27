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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const order_model_1 = require("./order.model");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
const users_model_1 = require("../users/users.model");
const mesengers_service_1 = require("./mesengers.service");
const parse_user_1 = require("../users/utils/parse.user");
let OrdersService = class OrdersService {
    constructor(mesengersService, ordersModel, userModel) {
        this.mesengersService = mesengersService;
        this.ordersModel = ordersModel;
        this.userModel = userModel;
    }
    async findAllOrders() {
        try {
            const find = await this.ordersModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async findOrderById(id) {
        try {
            const find = await this.ordersModel.findById({ _id: id }).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async findOrderByPhone(phone) {
        try {
            const find = await this.ordersModel.findOne({ phone: phone }).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async generateSixDigitNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async create(orderObj) {
        try {
            const params = __rest(orderObj, []);
            const verificationCode = await this.generateSixDigitNumber();
            const createdOrder = await this.ordersModel.create(params);
            await this.ordersModel.findByIdAndUpdate({ _id: createdOrder._id }, { sms: verificationCode });
            const order = await this.ordersModel.findById(createdOrder._id);
            const allOrders = await this.ordersModel.find({ phone: order.phone });
            if (Array.isArray(allOrders) && allOrders.length !== 0) {
                const tgChat = allOrders[0].tg_chat;
                const viber = allOrders[0].viber_chat;
                if (tgChat !== null) {
                    await this.mesengersService.sendCode(tgChat);
                    return order;
                }
                else if (viber !== null) {
                    await this.mesengersService.sendCode(viber);
                    return order;
                }
                else {
                    return order;
                }
            }
            return order;
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async verifyOrder(code) {
        try {
            const order = await this.ordersModel.findOne({ sms: code });
            if (order === null) {
                throw new http_errors_1.NotFound('Order not found');
            }
            else if (order.verify === false) {
                await this.ordersModel.findByIdAndUpdate({ _id: order._id }, { verify: true, sms: null });
                const usersArr = await this.findUserByCategory(order);
                const sendMessagePromises = usersArr.map(async (user) => {
                    if (user.tg_chat !== null) {
                        const check = await this.checkTrialStatus(user._id);
                        if (check === true) {
                            await this.mesengersService.sendNewTgOrder(user.tg_chat, order);
                        }
                    }
                    if (user.viber_chat !== null) {
                        const check = await this.checkTrialStatus(user._id);
                        if (check === true) {
                            await this.mesengersService.sendNewViberOrder(user.viber_chat, order);
                        }
                    }
                });
                await Promise.all(sendMessagePromises);
                if (usersArr.length !== 0) {
                    const message = `Ваше замовлення було успішно опубліковано. По вашим параметрам знайшлося ${usersArr.length} виконавців.`;
                    if (order.tg_chat !== null) {
                        await this.mesengersService.sendMessageTg(order.tg_chat, message);
                    }
                    else if (order.viber_chat !== null) {
                        await this.mesengersService.sendMessageViber(order.viber_chat, message);
                    }
                    return usersArr;
                }
                else {
                    const message = 'На жаль, ніхто не підійшов під ваше замовлення. Спробуйте пізніше або виконайте пошук самостійно https://www.wechirka.com/artists';
                    if (order.tg_chat !== null) {
                        await this.mesengersService.sendMessageTg(order.tg_chat, message);
                    }
                    else if (order.viber_chat !== null) {
                        await this.mesengersService.sendMessageViber(order.viber_chat, message);
                    }
                    return usersArr;
                }
            }
            else {
                throw new http_errors_1.BadRequest('Order not found');
            }
        }
        catch (e) {
            throw e;
        }
    }
    async checkTrialStatus(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new http_errors_1.NotFound('User not found');
        }
        if (user.trialEnds > new Date() || user.paidEnds > new Date()) {
            return true;
        }
        else {
            user.trial = false;
            user.paid = false;
            await user.save();
            return false;
        }
    }
    async findUserByCategory(order) {
        const orderCategories = order.category;
        function extractIds(data) {
            const ids = [];
            function recursiveExtract(obj) {
                for (const key in obj) {
                    if (key === 'id') {
                        ids.push(obj[key]);
                    }
                    else if (typeof obj[key] === 'object') {
                        recursiveExtract(obj[key]);
                    }
                }
            }
            recursiveExtract(data);
            return ids;
        }
        const subcategoriesId = extractIds(orderCategories);
        const findId = subcategoriesId[0];
        const subcategory = await this.userModel
            .find({
            'category.subcategories': {
                $elemMatch: {
                    id: findId,
                },
            },
            location: order.location,
        })
            .exec();
        if (Array.isArray(subcategory) && subcategory.length === 0) {
            const [city, region, country] = order.location.split(', ');
            if (country === undefined) {
                const regexLocation = new RegExp('Київська область', 'i');
                const category = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: findId,
                        },
                    },
                    location: { $regex: regexLocation },
                })
                    .exec();
                return category;
            }
            else {
                const regexLocation = new RegExp(region, 'i');
                const category = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: findId,
                        },
                    },
                    location: { $regex: regexLocation },
                })
                    .exec();
                return category;
            }
        }
        return subcategory;
    }
    async searchOrders(query) {
        const { req, loc, page, cat, subcat } = query;
        try {
            const curentPage = page || 1;
            const limit = 8;
            const totalCount = await this.ordersModel.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            const offset = (curentPage - 1) * limit;
            if (!req && !loc && !cat && !subcat) {
                const result = await this.ordersModel
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
                const category = await this.ordersModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.ordersModel
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
                    throw new http_errors_1.NotFound('Orders not found');
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
                const findCat = await this.ordersModel
                    .find({
                    category: {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findSubcat = await this.ordersModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findDescr = await this.ordersModel
                    .find({
                    description: { $regex: regexReq },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const category = await this.ordersModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.ordersModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findLocation = await this.ordersModel
                    .find({
                    location: { $regex: regexReq },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findName = await this.ordersModel
                    .find({
                    name: { $regex: regexReq },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = (0, parse_user_1.mergeAndRemoveDuplicates)(findDescr, category, subcategory, findCat, findSubcat, findLocation, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Orders not found');
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
                const findLocation = await this.ordersModel
                    .find({
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .skip(offset)
                    .limit(limit)
                    .exec();
                const category = await this.ordersModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.ordersModel
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
                    throw new http_errors_1.NotFound('Orders not found');
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
                const findDescr = await this.ordersModel
                    .find({
                    description: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const category = await this.ordersModel
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
                const subcategory = await this.ordersModel
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
                const findCat = await this.ordersModel
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
                const findSubcat = await this.ordersModel
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
                const findName = await this.ordersModel
                    .find({
                    name: { $regex: regexReq },
                    location: { $regex: regexLoc },
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = (0, parse_user_1.mergeAndRemoveDuplicates)(findDescr, category, subcategory, findCat, findSubcat, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Orders not found');
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
            throw new http_errors_1.NotFound('Orders not found');
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(2, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [mesengers_service_1.MesengersService,
        order_model_1.Orders,
        users_model_1.User])
], OrdersService);
//# sourceMappingURL=orders.service.js.map