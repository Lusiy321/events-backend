"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = require("express");
const swagger_1 = require("@nestjs/swagger");
const mesengers_service_1 = require("./orders/mesengers.service");
async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(express_1.default), {
        cors: true,
    });
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Event and Show server')
        .setDescription('REAST API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth({
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'BearerAuthMethod')
        .addServer(`https://events-4qv2.onrender.com`)
        .addServer(`http://localhost:${PORT}`)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(PORT, () => console.log(`Server started on port = http://localhost:${PORT}`));
    const mesengersService = app.get(mesengers_service_1.MesengersService);
    await mesengersService.startServer();
}
start();
//# sourceMappingURL=main.js.map