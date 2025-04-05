"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoutes = void 0;
const hono_1 = require("hono");
const authentication_controllers_1 = require("../controllers/authentication/authentication-controllers");
const authentication_types_1 = require("../controllers/authentication/authentication-types");
exports.authenticationRoutes = new hono_1.Hono();
exports.authenticationRoutes.post("/sign-up", async (c) => {
    const { username, password, name } = await c.req.json();
    try {
        const result = await (0, authentication_controllers_1.signUpWithUsernameAndPassword)({
            username,
            password,
            name
        });
        return c.json({ data: result }, 200);
    }
    catch (error) {
        if (error === authentication_types_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
            return c.json({ error: "Username already exists" }, 409);
        }
        if (error === authentication_types_1.SignUpWithUsernameAndPasswordError.UNKNOWN) {
            return c.json({ error: "Unknown error" }, 500);
        }
    }
});
exports.authenticationRoutes.post("/log-in", async (c) => {
    try {
        const { username, password, name } = await c.req.json();
        const result = await (0, authentication_controllers_1.logInWithUsernameAndPassword)({
            username,
            password,
            name
        });
        return c.json({
            data: result,
        }, 200);
    }
    catch (error) {
        if (error === authentication_types_1.LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD) {
            return c.json({ error: "Incorrect username or password" }, 401);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
