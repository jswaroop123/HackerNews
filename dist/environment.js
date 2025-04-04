"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecretKey = void 0;
exports.jwtSecretKey = process.env.KEY || process.exit(1);
