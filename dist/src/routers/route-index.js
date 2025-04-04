"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const hono_1 = require("hono");
const authentication_routes_1 = require("./authentication-routes");
const logger_1 = require("hono/logger");
const user_routes_1 = require("./user-routes");
const post_route_1 = require("./post-route");
const like_route_1 = require("./like-route");
const comment_route_1 = require("./comment-route");
exports.allRoutes = new hono_1.Hono();
exports.allRoutes.use((0, logger_1.logger)());
exports.allRoutes.route("/authentication", authentication_routes_1.authenticationRoutes);
exports.allRoutes.route("/users", user_routes_1.usersRoutes);
exports.allRoutes.route("/posts", post_route_1.postsRoutes);
exports.allRoutes.route("/likes", like_route_1.likesRoutes);
exports.allRoutes.route("/comments", comment_route_1.commentsRoutes);
