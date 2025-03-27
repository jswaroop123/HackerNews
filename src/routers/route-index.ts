import { Hono } from "hono";
import { authenticationRoutes } from "./authentication-routes";
import { logger } from "hono/logger";

export const allRoutes = new Hono();

allRoutes.use(logger())



allRoutes.route("/authentication", authenticationRoutes);


allRoutes.get(
  "/health",
  (context) => {
    console.log("Health checked");
    return context.json({ message: "OK" }, 200);
  }
);