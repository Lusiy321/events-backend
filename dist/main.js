"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const session = require("express-session");
async function start() {
    const PORT = process.env.PORT || 5000;
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
    app.enableCors({
        origin: 'https://www.wechirka.com',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    await app.listen(PORT, () => console.log(`Server started on port = http://localhost:${PORT}`));
}
start();
//# sourceMappingURL=main.js.map