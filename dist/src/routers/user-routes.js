"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const token_middleware_1 = require("./middleware/token-middleware");
const user_controllers_1 = require("../controllers/users/user-controllers");
const user_types_1 = require("../controllers/users/user-types");
const pagination_1 = require("../extras/pagination");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.get("/me", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId");
        const result = await (0, user_controllers_1.GetMe)({ userId });
        if (!result) {
            return context.json({ error: "User not found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === user_types_1.GetMeError.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (error === user_types_1.GetMeError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
// usersRoutes.get("/all", tokenMiddleware, async (context) => {
//   try {
//     const result = await GetAllUsers();
//     if (!result) {
//       return context.json({ error: "Users not found" }, 404);
//     }
//     return context.json(result, 200);
//   } catch (error) {
//     if (error === GetAllUsersError.NO_USERS_FOUND) {
//       return context.json({ error: "Users not found" }, 404);
//     }
//     if (error === GetAllUsersError.UNKNOWN) {
//       return context.json({ error: "Unknown error" }, 500);
//     }
//   }
// });
//user-routes.ts
exports.usersRoutes.get("/", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, user_controllers_1.GetAllUsers)({ page, limit });
        if (!result) {
            return context.json({ error: "No users found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === user_types_1.GetAllUsersError.NO_USERS_FOUND) {
            return context.json({ error: "No users found" }, 404);
        }
        if (error === user_types_1.GetAllUsersError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No users found on the page requested]" }, 404);
        }
        if (error === user_types_1.GetAllUsersError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
