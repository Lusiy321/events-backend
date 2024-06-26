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
exports.UsersResolver = exports.SearchQuery = void 0;
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const users_model_1 = require("./users.model");
const create_user_dto_1 = require("./dto/create.user.dto");
const password_user_dto_1 = require("./dto/password.user.dto");
const search_service_1 = require("./search.service");
const update_user_dto_1 = require("./dto/update.user.dto");
let SearchQuery = class SearchQuery {
};
exports.SearchQuery = SearchQuery;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SearchQuery.prototype, "req", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SearchQuery.prototype, "loc", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], SearchQuery.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SearchQuery.prototype, "cat", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SearchQuery.prototype, "subcat", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], SearchQuery.prototype, "limit", void 0);
exports.SearchQuery = SearchQuery = __decorate([
    (0, graphql_1.InputType)()
], SearchQuery);
let UsersResolver = class UsersResolver {
    constructor(usersService, searchService) {
        this.usersService = usersService;
        this.searchService = searchService;
    }
    async getUsers(query) {
        try {
            return this.searchService.searchUsers(query);
        }
        catch (error) {
            throw error;
        }
    }
    async getUserById(id) {
        return this.usersService.findById(id);
    }
    async createUser(data) {
        return this.usersService.create(data);
    }
    async deleteUser(req, password) {
        return this.usersService.deleteUserProfile(req, password);
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, graphql_1.Query)(() => update_user_dto_1.search_result, { name: 'allUsers' }),
    __param(0, (0, graphql_1.Args)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchQuery]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUsers", null);
__decorate([
    (0, graphql_1.Query)(() => users_model_1.User, { name: 'user' }),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "getUserById", null);
__decorate([
    (0, graphql_1.Mutation)(() => users_model_1.User),
    __param(0, (0, graphql_1.Args)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "createUser", null);
__decorate([
    (0, graphql_1.Mutation)(() => users_model_1.User),
    __param(1, (0, graphql_1.Args)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, password_user_dto_1.PasswordUserDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "deleteUser", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)(() => users_model_1.User),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        search_service_1.SearchService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map