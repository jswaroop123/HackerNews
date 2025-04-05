"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerMiddleware = void 0;
const hono_1 = require("hono");
const serve_static_1 = require("@hono/node-server/serve-static");
const swagger_jsdoc_1 = require("swagger-jsdoc");
const fs_1 = require("fs");
const path_1 = require("path");
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'HackerNews API',
            version: '2.0.3',
            description: 'HackerNews clone server',
            contact: {
                name: 'HackerNews-Server',
                url: 'https://github.com/jswaroop123/HackerNews',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['src/routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
const swaggerUIPath = (0, path_1.join)(process.cwd(), 'node_modules/swagger-ui-dist');
exports.swaggerMiddleware = new hono_1.Hono();
exports.swaggerMiddleware.get('/swagger.json', (c) => {
    return c.json(swaggerSpec);
});
exports.swaggerMiddleware.get('/ui', (c) => {
    let html = (0, fs_1.readFileSync)((0, path_1.join)(swaggerUIPath, 'index.html'), 'utf-8');
    html = html.replace('https://petstore.swagger.io/v2/swagger.json', '/docs/swagger.json');
    html = html.replace(/href="\.\/swagger-ui.css"/, 'href="/docs/swagger-ui/swagger-ui.css"');
    html = html.replace(/src="\.\/swagger-ui-bundle.js"/, 'src="/docs/swagger-ui/swagger-ui-bundle.js"');
    html = html.replace(/src="\.\/swagger-ui-standalone-preset.js"/, 'src="/docs/swagger-ui/swagger-ui-standalone-preset.js"');
    return c.html(html);
});
exports.swaggerMiddleware.use('/swagger-ui/*', (0, serve_static_1.serveStatic)({ root: swaggerUIPath }));
