import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { logger } from "hono/logger";
import { usersRoutes } from "./user-routes";

export const allRoutes = new Hono();

allRoutes.use(logger())



allRoutes.route("/authentication", authenticationRoutes);
allRoutes.route("/users",usersRoutes)


allRoutes.get(
  "/health",
  (context) => {
    console.log("Health checked");
    return context.json({ message: "OK" }, 200);
  }
);