import { prisma } from "../../extras/prisma";
import { GetMeError, GetAllUsersError } from "./user-types";
export const GetMe = async (parameters) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parameters.userId },
        });
        if (!user) {
            throw GetMeError.USER_NOT_FOUND;
        }
        const result = {
            user: user,
        };
        return result;
    }
    catch (e) {
        console.error(e);
        throw GetMeError.UNKNOWN;
    }
};
//user- controllers.ts
export const GetAllUsers = async (parameter) => {
    try {
        const { page, limit } = parameter;
        const skip = (page - 1) * limit;
        // First we will check if there are any users at all
        const totalUsers = await prisma.user.count();
        if (totalUsers === 0) {
            throw GetAllUsersError.NO_USERS_FOUND;
        }
        // Then we will check if the requested page exists
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw GetAllUsersError.PAGE_BEYOND_LIMIT;
        }
        const users = await prisma.user.findMany({
            orderBy: { username: "asc" },
            skip,
            take: limit,
        });
        return { users };
    }
    catch (e) {
        console.error(e);
        if (e === GetAllUsersError.NO_USERS_FOUND ||
            e === GetAllUsersError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw GetAllUsersError.UNKNOWN;
    }
};
