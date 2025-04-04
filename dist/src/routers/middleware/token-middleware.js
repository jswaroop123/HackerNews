import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../../environment";
//high-order function -> function having a function as a parameter which returns a function
export const tokenMiddleware = createMiddleware(async (context, next) => {
    const token = context.req.header("token");
    if (!token) {
        return context.json({ error: "Unauthorized" }, 401);
    }
    try {
        const payload = jwt.verify(token, jwtSecretKey);
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
