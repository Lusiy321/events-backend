"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./users/users.module");
const users_model_1 = require("./users/users.model");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const category_model_1 = require("./users/category.model");
const orders_module_1 = require("./orders/orders.module");
const order_model_1 = require("./orders/order.model");
const admin_service_1 = require("./admin/admin.service");
const admin_controller_1 = require("./admin/admin.controller");
const admin_module_1 = require("./admin/admin.module");
const admin_model_1 = require("./admin/admin.model");
const posts_module_1 = require("./posts/posts.module");
const banners_module_1 = require("./banners/banners.module");
const order_archive_model_1 = require("./orders/order.archive.model");
const banners_model_1 = require("./banners/banners.model");
const posts_model_1 = require("./posts/posts.model");
const validation_orders_1 = require("./middleware/validation.orders");
const validation_users_1 = require("./middleware/validation.users");
const apollo_1 = require("@nestjs/apollo");
const graphql_1 = require("@nestjs/graphql");
const live_module_1 = require("./live/live.module");
const cors = require("cors");
const live_model_1 = require("./live/live.model");
const live_service_1 = require("./live/live.service");
const live_controller_1 = require("./live/live.controller");
const banners_service_1 = require("./banners/banners.service");
const path_1 = require("path");
const graphql_2 = require("graphql");
const places_module_1 = require("./places/places.module");
const places_model_1 = require("./places/places.model");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(validation_orders_1.ValidationOrders).forRoutes('./orders/orders.controller');
        consumer.apply(validation_users_1.ValidationUsers).forRoutes('./users/users.controller');
        consumer.apply(cors()).forRoutes({
            path: '*',
            method: common_1.RequestMethod.ALL,
        });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController, admin_controller_1.AdminController, live_controller_1.LiveController],
        providers: [users_service_1.UsersService, admin_service_1.AdminService, live_service_1.LiveService, banners_service_1.BannersService],
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `.env`,
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/users/utils/user.gql'),
                context: ({ req }) => req,
                csrfPrevention: false,
                introspection: true,
                installSubscriptionHandlers: true,
                playground: true,
                buildSchemaOptions: {
                    directives: [
                        new graphql_2.GraphQLDirective({
                            name: 'upper',
                            locations: [graphql_2.DirectiveLocation.FIELD_DEFINITION],
                        }),
                    ],
                },
            }),
            mongoose_1.MongooseModule.forRoot(process.env.DB_HOST),
            mongoose_1.MongooseModule.forFeature([
                { name: admin_model_1.Admin.name, schema: admin_model_1.AdminSchema, collection: 'admins' },
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
                { name: category_model_1.Category.name, schema: category_model_1.CategorySchema, collection: 'categories' },
                { name: order_model_1.Orders.name, schema: order_model_1.OrderSchema, collection: 'orders' },
                { name: banners_model_1.Banner.name, schema: banners_model_1.BannerSchema, collection: 'banners' },
                { name: posts_model_1.Posts.name, schema: posts_model_1.PostSchema, collection: 'posts' },
                { name: live_model_1.Live.name, schema: live_model_1.LiveSchema, collection: 'live' },
                { name: places_model_1.Place.name, schema: places_model_1.PlaceSchema, collection: 'places' },
                {
                    name: order_archive_model_1.OrdersArchive.name,
                    schema: order_archive_model_1.OrdersArchiveSchema,
                    collection: 'orders-archive',
                },
            ]),
            users_module_1.UsersModule,
            orders_module_1.OrdersModule,
            admin_module_1.AdminModule,
            posts_module_1.PostsModule,
            banners_module_1.BannersModule,
            live_module_1.LiveModule,
            places_module_1.PlacesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map