import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { logger } from "hono/logger";
import { usersRoutes } from "./user-routes";
import { postsRoutes } from "./post-route";
import { likesRoutes } from "./like-route";
import { commentsRoutes } from "./comment-route";
import { swaggerUI } from "@hono/swagger-ui";
import { swaggerDocument } from './swagger-docs';


export const allRoutes = new Hono();

allRoutes.use(logger())


allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/users",usersRoutes)
allRoutes.route("/posts",postsRoutes) 
allRoutes.route("/likes",likesRoutes)
allRoutes.route("/comments", commentsRoutes)
allRoutes.get("/ui", swaggerUI({ url: "/docs" }));
allRoutes.route("/", swaggerDocument);

