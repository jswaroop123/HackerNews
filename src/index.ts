import { serve } from "@hono/node-server";
import { allRoutes } from "./routers/route-index";



serve(allRoutes, ({ port }) => {
  console.log(`\tRunning @ http://localhost:${port}`);
});