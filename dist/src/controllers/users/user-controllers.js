"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsers = exports.GetMe = void 0;
const prisma_1 = require("../../extras/prisma");
const user_types_1 = require("./user-types");
const GetMe = async (parameters) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: parameters.userId },
        });
        if (!user) {
            throw user_types_1.GetMeError.USER_NOT_FOUND;
        }
        const result = {
            user: user,
        };
        return result;
    }
    catch (e) {
        console.error(e);
        throw user_types_1.GetMeError.UNKNOWN;
    }
};
exports.GetMe = GetMe;
//user- controllers.ts
const GetAllUsers = async (parameter) => {
    try {
        const { page, limit } = parameter;
        const skip = (page - 1) * limit;
        // First we will check if there are any users at all
        const totalUsers = await prisma_1.prisma.user.count();
        if (totalUsers === 0) {
            throw user_types_1.GetAllUsersError.NO_USERS_FOUND;
        }
        // Then we will check if the requested page exists
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw user_types_1.GetAllUsersError.PAGE_BEYOND_LIMIT;
        }
        const users = await prisma_1.prisma.user.findMany({
            orderBy: { username: "asc" },
            skip,
            take: limit,
        });
        return { users };
    }
    catch (e) {
        console.error(e);
        if (e === user_types_1.GetAllUsersError.NO_USERS_FOUND ||
            e === user_types_1.GetAllUsersError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw user_types_1.GetAllUsersError.UNKNOWN;
    }
};
exports.GetAllUsers = GetAllUsers;
