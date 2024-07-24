"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesModule = void 0;
const common_1 = require("@nestjs/common");
const places_service_1 = require("./places.service");
const places_controller_1 = require("./places.controller");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const places_model_1 = require("./places.model");
const cloudinary_service_1 = require("../users/cloudinary.service");
const nodemailer = require("nodemailer");
const users_model_1 = require("../users/users.model");
const category_place_model_1 = require("./category.place.model");
let PlacesModule = class PlacesModule {
};
exports.PlacesModule = PlacesModule;
exports.PlacesModule = PlacesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: { expiresIn: '1day' },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
                { name: places_model_1.Place.name, schema: places_model_1.PlaceSchema, collection: 'places' },
                {
                    name: category_place_model_1.CategoryPlace.name,
                    schema: category_place_model_1.CategoryPlaceSchema,
                    collection: 'place-categories',
                },
            ]),
        ],
        providers: [
            places_service_1.PlacesService,
            cloudinary_service_1.CloudinaryService,
            {
                provide: places_service_1.TRANSPORTER_PROVIDER,
                useFactory: () => {
                    return nodemailer.createTransport({
                        host: 'smtp.zoho.eu',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.NOREPLY_MAIL,
                            pass: process.env.NOREPLY_PASSWORD,
                        },
                    });
                },
            },
        ],
        controllers: [places_controller_1.PlacesController],
    })
], PlacesModule);
//# sourceMappingURL=places.module.js.map