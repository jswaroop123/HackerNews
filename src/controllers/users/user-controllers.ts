import { prisma } from "../../extras/prisma";
import { GetMeError, type GetMeResult, type GetAllUsersResult, GetAllUsersError } from "./user-types";


export const GetMe = async (parameters: {
    userId: string;
}): Promise<GetMeResult> => {
    try {
        const user = await prisma.user.findUnique({
        where: { id: parameters.userId },
    });

        if (!user) {
            throw GetMeError.USER_NOT_FOUND;
        }

        const result: GetMeResult = {
            user: user,
        }

        return result;
    } catch (e) {
        console.error(e);
        throw GetMeError.UNKNOWN;
    }
}

export const GetAllUsers = async (): Promise<GetAllUsersResult> => {
    try {
        const users = await prisma.user.findMany();
        if (!users) {
            throw GetAllUsersError.NO_USERS_FOUND;
        }
        const result: GetAllUsersResult = {
            users: users,
        }
        return result;
        
    } catch (e) {
        console.error(e);
        throw GetAllUsersError.UNKNOWN;
    }
}