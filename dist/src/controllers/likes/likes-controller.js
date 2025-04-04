import { prisma } from "../../extras/prisma";
import { LikeStatus, DeleteLikeError } from "./like-types";
export const createLike = async (postId, userId) => {
    try {
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return { status: LikeStatus.POST_NOT_FOUND };
        }
        const existingLike = await prisma.like.findFirst({
            where: { userId, postId }, // Finds if the user has already liked the post
        });
        if (existingLike) {
            return { status: LikeStatus.ALREADY_LIKED };
        }
        await prisma.like.create({ data: { userId, postId } });
        return { status: LikeStatus.LIKE_SUCCESS };
    }
    catch (error) {
        console.error(error);
        return { status: LikeStatus.UNKNOWN };
    }
};
export const getLikes = async (params) => {
    try {
        const { postId, page, limit } = params;
        const likes = await prisma.like.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" }, // Reverse chronological order
            skip: (page - 1) * limit,
            take: limit,
            select: {
                id: true,
                createdAt: true,
                postId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        if (!likes.length) {
            return { status: LikeStatus.NO_LIKES_FOUND };
        }
        return { likes };
    }
    catch (error) {
        console.error(error);
        throw LikeStatus.UNKNOWN;
    }
    ;
};
export const deleteLike = async (params) => {
    try {
        const { postId, userId } = params;
        const like = await prisma.like.findFirst({
            where: { postId, userId },
        });
        const postExists = await prisma.post.findUnique({
            where: { id: postId },
            select: { id: true }, // Only fetch the ID to reduce query load
        });
        if (!postExists) {
            return { status: DeleteLikeError.POST_NOT_FOUND };
        }
        if (!like) {
            return { status: DeleteLikeError.LIKE_NOT_FOUND };
        }
        await prisma.like.delete({
            where: { id: like.id },
        });
        return { status: DeleteLikeError.DELETE_SUCCESS };
    }
    catch (error) {
        console.error(error);
        return { status: DeleteLikeError.DELETE_FAILED };
    }
};
