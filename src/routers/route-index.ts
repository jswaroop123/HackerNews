import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { logger } from "hono/logger";
import { usersRoutes } from "./user-routes";
import { postsRoutes } from "./post-route";
import { likesRoutes } from "./like-route";

export const allRoutes = new Hono();

allRoutes.use(logger())


allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/users",usersRoutes)
allRoutes.route("/posts",postsRoutes) 
allRoutes.route("/likes",likesRoutes)


