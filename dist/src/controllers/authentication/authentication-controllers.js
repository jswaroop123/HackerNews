"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInWithUsernameAndPassword = exports.signUpWithUsernameAndPassword = exports.createPasswordHash = void 0;
const crypto_1 = require("crypto");
const authentication_types_1 = require("./authentication-types");
const prisma_1 = require("../../extras/prisma");
const jwt = require("jsonwebtoken");
const environment_1 = require("../../../environment");
const createPasswordHash = (parameters) => {
    return (0, crypto_1.createHash)("sha256").update(parameters.password).digest("hex");
};
exports.createPasswordHash = createPasswordHash;
const createJWToken = (parameters) => {
    // Generate token
    const jwtPayload = {
        iss: "https://purpleshorts.co.in",
        sub: parameters.id,
        username: parameters.username,
    };
    const token = jwt.sign(jwtPayload, environment_1.jwtSecretKey, {
        expiresIn: "30d",
    });
    return token;
};
const signUpWithUsernameAndPassword = async (parameters) => {
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: {
                username: parameters.username,
            },
        });
        if (existingUser) {
            throw authentication_types_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
        }
        const hashedPassword = (0, exports.createPasswordHash)({
            password: parameters.password
        });
        const user = await prisma_1.prisma.user.create({
            data: {
                username: parameters.username,
                password: hashedPassword,
                name: parameters.name
            },
        });
        //Generate Token
        const jwtPayload = {
            iss: "http://purpleshorts.co.in",
            sub: user.id,
            username: user.username,
        };
        const token = jwt.sign(jwtPayload, environment_1.jwtSecretKey, {
            expiresIn: "30d",
        });
        const result = {
            token,
            user,
        };
        return result;
    }
    catch (e) {
        console.error(e);
        throw authentication_types_1.SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
exports.signUpWithUsernameAndPassword = signUpWithUsernameAndPassword;
const logInWithUsernameAndPassword = async (parameters) => {
    const passwordHash = (0, exports.createPasswordHash)({
        password: parameters.password,
    });
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            username: parameters.username,
            password: passwordHash,
            name: parameters.name
        },
    });
    if (!user) {
        throw authentication_types_1.LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
    }
    const token = createJWToken({
        id: user.id,
        username: user.username,
    });
    const result = {
        token,
        user,
    };
    return result;
};
exports.logInWithUsernameAndPassword = logInWithUsernameAndPassword;
