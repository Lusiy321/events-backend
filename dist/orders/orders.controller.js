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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const twilio_service_1 = require("./twilio.service");
const swagger_1 = require("@nestjs/swagger");
const order_model_1 = require("./order.model");
const create_order_dto_1 = require("./dto/create.order.dto");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
let OrdersController = class OrdersController {
    constructor(ordersService, twilioService, ordersModel) {
        this.ordersService = ordersService;
        this.twilioService = twilioService;
        this.ordersModel = ordersModel;
    }
    async findOrders() {
        return this.ordersService.findAllOrders();
    }
    async findIdOrders(id) {
        return this.ordersService.findOrderById(id);
    }
    async create(user) {
        return this.ordersService.create(user);
    }
    async bot(res) {
        return res.redirect('viber://pa?chatURI=wechirka', 200);
    }
    async sendVerificationCode(phoneNumber) {
        const user = await this.ordersModel.findOne({ phone: phoneNumber });
        try {
            await this.twilioService.sendSMS(phoneNumber, `Your verification code: ${user.sms}`);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
        return await this.ordersModel.findOne({ phone: phoneNumber });
    }
    async verifyBySms(code) {
        await this.ordersService.verifyOrder(code);
        return await this.ordersModel.findOne({ sms: code });
    }
    async findPhoneUser(phone) {
        return this.ordersService.findOrderByPhone(phone);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.Get)('/find'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get orders by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.Get)('/find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findIdOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Order' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'BOT' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.Get)('/bot'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "bot", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Send sms code' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/send-code/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "sendVerificationCode", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verivy sms order' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/verify/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "verifyBySms", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, common_1.Get)('/find/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findPhoneUser", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __param(2, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        twilio_service_1.TwilioService,
        order_model_1.Orders])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map