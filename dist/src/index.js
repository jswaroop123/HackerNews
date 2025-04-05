"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_server_1 = require("@hono/node-server");
const route_index_1 = require("./routers/route-index");
(0, node_server_1.serve)(route_index_1.allRoutes);
console.log(`Server is running on http://localhost:${3000}`);
