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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
const parse_user_1 = require("./utils/parse.user");
const http_errors_1 = require("http-errors");
const order_model_1 = require("../orders/order.model");
let SearchService = class SearchService {
    constructor(userModel, ordersModel) {
        this.userModel = userModel;
        this.ordersModel = ordersModel;
    }
    async searchUsers(query) {
        const { req, loc, page, cat, subcat, limit } = query;
        try {
            const curentPage = page || 1;
            const curentlimit = limit || 8;
            const totalCount = await this.userModel.countDocuments();
            const totalPages = Math.ceil(totalCount / curentlimit);
            const offset = (curentPage - 1) * curentlimit;
            if (!req && !loc && !cat && !subcat) {
                const result = await this.userModel
                    .aggregate([
                    {
                        $match: {
                            verify: true,
                            title: { $exists: true },
                            description: { $exists: true },
                        },
                    },
                    { $sample: { size: curentlimit } },
                ])
                    .limit(curentlimit)
                    .skip(offset)
                    .exec();
                return {
                    totalPages: totalPages,
                    currentPage: curentPage,
                    data: result,
                };
            }
            const regexReq = new RegExp(req, 'i');
            const regexLoc = new RegExp(loc, 'i');
            if ((!req && !loc) ||
                (cat && !subcat && !loc) ||
                (cat && subcat && !loc)) {
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(category, subcategory);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    return {
                        totalPages: 0,
                        currentPage: 0,
                        data: resultArray,
                    };
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            if (req && !loc && !cat && !subcat) {
                const findTitle = await this.userModel
                    .find({
                    title: { $regex: regexReq },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const findCat = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const findSubcat = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            name: { $regex: regexReq },
                        },
                    },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const findDescr = await this.userModel
                    .find({
                    description: { $regex: regexReq },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const findLocation = await this.userModel
                    .find({
                    location: { $regex: regexReq },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const findName = await this.userModel
                    .find({
                    firstName: { $regex: regexReq },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(findTitle, findDescr, findCat, findSubcat, findLocation, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    return {
                        totalPages: 0,
                        currentPage: 0,
                        data: resultArray,
                    };
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            else if (!req && loc && cat && subcat) {
                const subcategory = await this.userModel
                    .find({
                    'category.subcategories': {
                        $elemMatch: {
                            id: subcat,
                        },
                    },
                    location: { $regex: regexLoc },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const randomArray = await (0, parse_user_1.shuffleArray)(subcategory);
                if (Array.isArray(randomArray) && randomArray.length === 0) {
                    return {
                        totalPages: 0,
                        currentPage: 0,
                        data: randomArray,
                    };
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(randomArray, curentPage);
                    const totalPages = Math.ceil(randomArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            else if (!req && loc && !cat && !subcat) {
                const location = await this.userModel
                    .find({
                    location: { $regex: regexLoc },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const randomArray = await (0, parse_user_1.shuffleArray)(location);
                if (Array.isArray(randomArray) && randomArray.length === 0) {
                    return {
                        totalPages: 0,
                        currentPage: 0,
                        data: randomArray,
                    };
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(randomArray, curentPage);
                    const totalPages = Math.ceil(randomArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            else if (!req && loc && cat && !subcat) {
                const category = await this.userModel
                    .find({
                    category: {
                        $elemMatch: {
                            _id: cat,
                        },
                    },
                    location: { $regex: regexLoc },
                    verify: true,
                })
                    .sort({ createdAt: -1 })
                    .select(parse_user_1.rows)
                    .exec();
                const randomArray = await (0, parse_user_1.shuffleArray)(category);
                if (Array.isArray(randomArray) && randomArray.length === 0) {
                    return {
                        totalPages: 0,
                        currentPage: 0,
                        data: randomArray,
                    };
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(randomArray, curentPage);
                    const totalPages = Math.ceil(randomArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
            else if ((req && loc && cat && subcat) ||
                (req && loc && cat && !subcat)) {
                const findTitle = await this.userModel
                    .find({
                    title: { $regex: regexReq },
                    location: { $regex: regexLoc },
                    verify: true,
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findDescr = await this.userModel
                    .find({
                    description: { $regex: regexReq },
                    location: { $regex: regexLoc },
                    verify: true,
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
                    verify: true,
                })
                    .select(parse_user_1.rows)
                    .exec();
                const subcategory = await this.userModel
                    .find({
                    $and: [
                        {
                            'category.subcategories': {
                                $elemMatch: {
                                    id: subcat,
                                },
                            },
                        },
                        {
                            location: { $regex: regexLoc },
                        },
                        { verify: true },
                    ],
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
                    verify: true,
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
                    verify: true,
                })
                    .select(parse_user_1.rows)
                    .exec();
                const findName = await this.userModel
                    .find({
                    firstName: { $regex: regexReq },
                    location: { $regex: regexLoc },
                    verify: true,
                })
                    .select(parse_user_1.rows)
                    .exec();
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(findTitle, findDescr, category, subcategory, findCat, findSubcat, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    return {
                        totalPages: 0,
                        currentPage: 0,
                        data: resultArray,
                    };
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
    async searchOrders(query) {
        const { req, loc, page, cat, subcat, limit } = query;
        try {
            const curentPage = page || 1;
            const curentlimit = 8;
            const totalCount = await this.ordersModel.countDocuments();
            const totalPages = Math.ceil(totalCount / curentlimit);
            const offset = (curentPage - 1) * curentlimit;
            if (!req && !loc && !cat && !subcat) {
                const result = await this.ordersModel
                    .find()
                    .select(parse_user_1.rows)
                    .skip(offset)
                    .sort({ createdAt: -1 })
                    .limit(curentlimit)
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
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(category, subcategory);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Orders not found');
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
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
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(findDescr, category, subcategory, findCat, findSubcat, findLocation, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Orders not found');
                }
                else {
                    const result = (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
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
                    .limit(curentlimit)
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
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(category, subcategory, findLocation);
                if (Array.isArray(resultArray) && findLocation.length === 0) {
                    throw new http_errors_1.NotFound('Orders not found');
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
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
                const resultArray = await (0, parse_user_1.mergeAndRemoveDuplicates)(findDescr, category, subcategory, findCat, findSubcat, findName);
                if (Array.isArray(resultArray) && resultArray.length === 0) {
                    throw new http_errors_1.NotFound('Orders not found');
                }
                else {
                    const result = await (0, parse_user_1.paginateArray)(resultArray, curentPage);
                    const totalPages = Math.ceil(resultArray.length / curentlimit);
                    return {
                        totalPages: totalPages,
                        currentPage: curentPage,
                        data: result,
                    };
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        order_model_1.Orders])
], SearchService);
//# sourceMappingURL=search.service.js.map