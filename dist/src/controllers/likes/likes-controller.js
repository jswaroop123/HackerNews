"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = exports.getLikes = exports.createLike = void 0;
const prisma_1 = require("../../extras/prisma");
const like_types_1 = require("./like-types");
const createLike = async (postId, userId) => {
    try {
        const post = await prisma_1.prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return { status: like_types_1.LikeStatus.POST_NOT_FOUND };
        }
        const existingLike = await prisma_1.prisma.like.findFirst({
            where: { userId, postId }, // Finds if the user has already liked the post
        });
        if (existingLike) {
            return { status: like_types_1.LikeStatus.ALREADY_LIKED };
        }
        await prisma_1.prisma.like.create({ data: { userId, postId } });
        return { status: like_types_1.LikeStatus.LIKE_SUCCESS };
    }
    catch (error) {
        console.error(error);
        return { status: like_types_1.LikeStatus.UNKNOWN };
    }
};
exports.createLike = createLike;
const getLikes = async (params) => {
    try {
        const { postId, page, limit } = params;
        const likes = await prisma_1.prisma.like.findMany({
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
            return { status: like_types_1.LikeStatus.NO_LIKES_FOUND };
        }
        return { likes };
    }
    catch (error) {
        console.error(error);
        throw like_types_1.LikeStatus.UNKNOWN;
    }
    ;
};
exports.getLikes = getLikes;
const deleteLike = async (params) => {
    try {
        const { postId, userId } = params;
        const like = await prisma_1.prisma.like.findFirst({
            where: { postId, userId },
        });
        const postExists = await prisma_1.prisma.post.findUnique({
            where: { id: postId },
            select: { id: true }, // Only fetch the ID to reduce query load
        });
        if (!postExists) {
            return { status: like_types_1.DeleteLikeError.POST_NOT_FOUND };
        }
        if (!like) {
            return { status: like_types_1.DeleteLikeError.LIKE_NOT_FOUND };
        }
        await prisma_1.prisma.like.delete({
            where: { id: like.id },
        });
        return { status: like_types_1.DeleteLikeError.DELETE_SUCCESS };
    }
    catch (error) {
        console.error(error);
        return { status: like_types_1.DeleteLikeError.DELETE_FAILED };
    }
};
exports.deleteLike = deleteLike;
