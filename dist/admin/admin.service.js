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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const admin_model_1 = require("./admin.model");
const users_model_1 = require("../users/users.model");
const order_model_1 = require("../orders/order.model");
let AdminService = class AdminService {
    constructor(adminModel, userModel, ordersModel) {
        this.adminModel = adminModel;
        this.userModel = userModel;
        this.ordersModel = ordersModel;
    }
    async createAdmin(admin, req) {
        const findSuper = await this.findToken(req);
        if (!findSuper) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            if (findSuper.role === 'superadmin') {
                const { username } = admin;
                const registration = await this.adminModel.findOne({
                    username: username,
                });
                if (registration) {
                    throw new http_errors_1.Conflict(`Admin with ${username} in use`);
                }
                const created = await this.adminModel.create(admin);
                created.setPassword(admin.password);
                created.save();
                return await this.adminModel.findById(created._id);
            }
            else {
                throw new http_errors_1.BadRequest('You are not superadmin');
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async login(user) {
        try {
            const { username, password } = user;
            const lowerCase = username.toLowerCase();
            const authUser = await this.adminModel.findOne({
                username: lowerCase,
            });
            if (!authUser || !authUser.comparePassword(password)) {
                throw new http_errors_1.Unauthorized(`Username or password is wrong`);
            }
            await this.createToken(authUser);
            return await this.adminModel.findOne({ username: lowerCase });
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async logout(req) {
        const admin = await this.findToken(req);
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            await this.adminModel.findByIdAndUpdate({ _id: admin.id }, { token: null });
            return await this.adminModel.findById({ _id: admin.id });
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async findAllAdmins(req) {
        try {
            const find = await this.adminModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findAdminById(id, req) {
        try {
            const find = await this.adminModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Admin not found');
        }
    }
    async findByIdUpdate(id, user, req) {
        const params = __rest(user, []);
        try {
            const findSuper = await this.findToken(req);
            if (!findSuper) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            if (findSuper.role === 'moderator' ||
                findSuper.role === 'admin' ||
                findSuper.role === 'superadmin') {
                if (params) {
                    if (params.password) {
                        const user = await this.userModel.findById({ _id: id });
                        user.setPassword(params.password);
                        user.save();
                        const userUpdate = this.userModel.findById({ _id: id });
                        return userUpdate;
                    }
                    await this.userModel.findByIdAndUpdate({ _id: id }, Object.assign({}, params));
                    const userUpdate = this.userModel.findById({ _id: id });
                    return userUpdate;
                }
                else {
                    throw new http_errors_1.BadRequest('You are not admin');
                }
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async banUser(id, req) {
        const admin = await this.findToken(req);
        const newSub = await this.userModel.findById(id);
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        if (!admin || !newSub) {
            throw new http_errors_1.Conflict('User not found');
        }
        try {
            const adm = admin.role === 'admin' ||
                admin.role === 'moderator' ||
                admin.role === 'superadmin';
            if (adm && newSub.ban === false) {
                newSub.ban = true;
                newSub.save();
                return this.userModel.findById(id);
            }
            else if (adm && newSub.ban === true) {
                newSub.ban = false;
                newSub.save();
                return this.userModel.findById(id);
            }
            else {
                return this.userModel.findById(id);
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async deleteUser(req, data) {
        const admin = await this.findToken(req);
        const params = __rest(data, []);
        console.log(params);
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        try {
            let respUsers = [];
            if (admin.role === 'admin' ||
                admin.role === 'moderator' ||
                admin.role === 'superadmin') {
                if ('userId' in params && Array.isArray(params.userId)) {
                    const arr = params.userId;
                    arr.map(async (id) => {
                        const delUsr = await this.userModel.findByIdAndRemove(id);
                        respUsers.push(delUsr);
                    });
                    return respUsers;
                }
                else if ('postId' in params && Array.isArray(params.postId)) {
                    const arr = params.postId;
                    arr.map(async (id) => {
                        const delUsr = await this.ordersModel.findByIdAndRemove(id);
                        respUsers.push(delUsr);
                    });
                    return respUsers;
                }
                else if ('adminId' in params && Array.isArray(params.adminId)) {
                    const arr = params.adminId;
                    arr.map(async (id) => {
                        const delUsr = await this.adminModel.findByIdAndRemove(id);
                        respUsers.push(delUsr);
                    });
                    return respUsers;
                }
                else {
                    throw new http_errors_1.NotFound('User not found');
                }
            }
            else {
                throw new http_errors_1.Conflict('Only admin can delete user');
            }
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async verifyUser(id, req, userUp) {
        const admin = await this.findToken(req);
        const user = await this.userModel.findById(id);
        if (!admin) {
            throw new http_errors_1.Unauthorized('jwt expired');
        }
        if (!admin || !user) {
            throw new http_errors_1.Conflict('Not found');
        }
        try {
            const adm = admin.role === 'admin' ||
                admin.role === 'moderator' ||
                admin.role === 'superadmin';
            if (adm && user.verify === 'new') {
                const params = __rest(userUp, []);
                await this.userModel.findByIdAndUpdate({ _id: id }, Object.assign({}, params));
                user.save();
                return await this.userModel.findById(id);
            }
            else {
                return user;
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
            const SECRET_KEY = process.env.SECRET_KEY;
            const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = await this.adminModel.findById({ _id: findId.id });
            return user;
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
        await this.adminModel.findByIdAndUpdate(authUser._id, { token });
        const authentificationUser = await this.adminModel.findById({
            _id: authUser._id,
        });
        return authentificationUser;
    }
    async refreshAccessToken(req) {
        const { authorization = '' } = req.headers;
        const [bearer, token] = authorization.split(' ');
        if (bearer !== 'Bearer') {
            throw new http_errors_1.Unauthorized('Not authorized');
        }
        try {
            const SECRET_KEY = process.env.SECRET_KEY;
            const user = await this.adminModel.findOne({ token: token });
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            const payload = {
                id: user._id,
            };
            const tokenRef = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '24h' });
            await this.adminModel.findByIdAndUpdate(user._id, { token: tokenRef });
            const authentificationUser = await this.adminModel.findById({
                _id: user.id,
            });
            return authentificationUser;
        }
        catch (error) {
            throw new http_errors_1.BadRequest('Invalid refresh token');
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_model_1.Admin.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __metadata("design:paramtypes", [admin_model_1.Admin,
        users_model_1.User,
        order_model_1.Orders])
], AdminService);
admin_model_1.AdminSchema.methods.setPassword = async function (password) {
    return (this.password = (0, bcrypt_1.hashSync)(password, 10));
};
admin_model_1.AdminSchema.methods.comparePassword = function (password) {
    return (0, bcrypt_1.compareSync)(password, this.password);
};
//# sourceMappingURL=admin.service.js.map