"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.findToken = exports.refreshAccessToken = void 0;
const http_errors_1 = require("http-errors");
const users_model_1 = require("../users.model");
const jsonwebtoken_1 = require("jsonwebtoken");
async function refreshAccessToken(req) {
    try {
        const { authorization = '' } = req.headers;
        const [bearer, token] = authorization.split(' ');
        if (bearer !== 'Bearer') {
            throw new http_errors_1.Unauthorized('Not authorized');
        }
        const user = await users_model_1.User.findById({ token: token });
        if (!user) {
            throw new Error('User not found');
        }
        const payload = {
            id: user._id,
        };
        const SECRET_KEY = process.env.SECRET_KEY;
        const accessToken = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '24h' });
        await this.userModel.findByIdAndUpdate(user._id, { accessToken });
        const authentificationUser = await users_model_1.User.findById({
            _id: user._id,
        });
        return authentificationUser;
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
}
exports.refreshAccessToken = refreshAccessToken;
async function findToken(req) {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        throw new http_errors_1.Unauthorized('Not authorized');
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
    const user = await this.User.findById({ _id: findId.id });
    return user;
}
exports.findToken = findToken;
async function createToken(authUser) {
    const payload = {
        id: authUser._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = (0, jsonwebtoken_1.sign)(payload, SECRET_KEY, { expiresIn: '15m' });
    await users_model_1.User.findByIdAndUpdate(authUser._id, { token });
    const authentificationUser = await users_model_1.User.findById({
        _id: authUser._id,
    });
    return authentificationUser;
}
exports.createToken = createToken;
//# sourceMappingURL=JWT.middleware.js.map