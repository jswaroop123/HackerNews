import "dotenv/config";
import { serve } from '@hono/node-server';
import { allRoutes } from "./routers/route-index";
serve(allRoutes);
console.log(`Server is running on http://localhost:${3000}`);
