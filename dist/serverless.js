"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const mesengers_service_1 = require("./orders/mesengers.service");
const session = require("express-session");
const serverless_express_1 = require("@vendia/serverless-express");
let server;
async function start() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(express_1.default), {
        cors: true,
    });
    app.use(session({
        secret: process.env.GOOGLE_CLIENT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
        },
    }));
    app
        .enableCors();
    const mesengersService = app.get(mesengers_service_1.MesengersService);
    await mesengersService.startServer();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return (0, serverless_express_1.default)({ app: expressApp });
}
const handler = async (event, context, callback) => {
    server = server !== null && server !== void 0 ? server : (await start());
    return server(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=serverless.js.map