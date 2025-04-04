"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const factory_1 = require("hono/factory");
const jwt = require("jsonwebtoken");
const environment_1 = require("../../../environment");
//high-order function -> function having a function as a parameter which returns a function
exports.tokenMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
    const token = context.req.header("token");
    if (!token) {
        return context.json({ error: "Unauthorized" }, 401);
    }
    try {
        const payload = jwt.verify(token, environment_1.jwtSecretKey);
        const userId = payload.sub;
        if (userId) {
            context.set("userId", userId);
        }
    }
    catch (error) {
        return context.json({ error: "Unauthorized" }, 401);
    }
    await next();
});
