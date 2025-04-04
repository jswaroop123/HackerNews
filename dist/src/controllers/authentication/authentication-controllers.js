import { createHash } from "crypto";
import { LogInWithUsernameAndPasswordError, SignUpWithUsernameAndPasswordError, } from "./authentication-types";
import { prisma } from "../../extras/prisma";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../../../environment";
export const createPasswordHash = (parameters) => {
    return createHash("sha256").update(parameters.password).digest("hex");
};
const createJWToken = (parameters) => {
    // Generate token
    const jwtPayload = {
        iss: "https://purpleshorts.co.in",
        sub: parameters.id,
        username: parameters.username,
    };
    const token = jwt.sign(jwtPayload, jwtSecretKey, {
        expiresIn: "30d",
    });
    return token;
};
export const signUpWithUsernameAndPassword = async (parameters) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                username: parameters.username,
            },
        });
        if (existingUser) {
            throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
        }
        const hashedPassword = createPasswordHash({
            password: parameters.password
        });
        const user = await prisma.user.create({
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
        const token = jwt.sign(jwtPayload, jwtSecretKey, {
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
        throw SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
export const logInWithUsernameAndPassword = async (parameters) => {
    const passwordHash = createPasswordHash({
        password: parameters.password,
    });
    const user = await prisma.user.findUnique({
        where: {
            username: parameters.username,
            password: passwordHash,
            name: parameters.name
        },
    });
    if (!user) {
        throw LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
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
