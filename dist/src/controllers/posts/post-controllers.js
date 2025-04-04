import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import { DeletePostError, GetPostsError, PostStatus, } from "./post-types";
export const createPost = async (parameters) => {
    try {
        if (!parameters.authorId) {
            return PostStatus.USER_NOT_FOUND;
        }
        const post = await prisma.post.create({
            data: {
                title: parameters.title,
                content: parameters.content,
                user: {
                    connect: {
                        id: parameters.authorId
                    }
                },
            },
        });
        return { post };
    }
    catch (error) {
        console.error(error);
        return PostStatus.POST_CREATION_FAILED;
    }
};
export const GetAllPostsForUser = async (parameter) => {
    try {
        const { userId, page, limit } = parameter;
        const skip = (page - 1) * limit;
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw GetPostsError.USER_NOT_FOUND;
        }
        // Then, check if the user has any posts
        const totalPosts = await prisma.post.count({ where: { userId } });
        if (totalPosts === 0) {
            throw GetPostsError.NO_POSTS_FOUND;
        }
        // Check if the requested page exists
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw GetPostsError.PAGE_BEYOND_LIMIT;
        }
        // Fetch the posts
        const posts = await prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });
        return { posts };
    }
    catch (e) {
        console.error(e);
        if (e === GetPostsError.USER_NOT_FOUND ||
            e === GetPostsError.NO_POSTS_FOUND ||
            e === GetPostsError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw GetPostsError.UNKNOWN;
    }
};
export const GetAllPosts = async (parameter) => {
    try {
        const { page, limit } = parameter;
        const skip = (page - 1) * limit;
        // Count total posts
        const totalPosts = await prisma.post.count();
        if (totalPosts === 0) {
            throw GetPostsError.NO_POSTS_FOUND;
        }
        // Check if the requested page exists
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw GetPostsError.PAGE_BEYOND_LIMIT;
        }
        // Fetch all posts
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "asc" },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        name: true,
                        username: true,
                    },
                },
            },
        });
        return { posts };
    }
    catch (e) {
        console.error(e);
        if (e === GetPostsError.NO_POSTS_FOUND || e === GetPostsError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw GetPostsError.UNKNOWN;
    }
};
export const deletePost = async (params) => {
    try {
        // Check if the post belongs to the user
        const post = await prisma.post.findUnique({
            where: { id: params.postId },
        });
        if (!post) {
            return DeletePostError.POST_NOT_FOUND;
        }
        if (post.userId !== params.userId) {
            return DeletePostError.UNAUTHORIZED;
        }
        await prisma.post.delete({
            where: { id: params.postId },
        });
        return DeletePostError.DELETE_SUCCESS;
    }
    catch (error) {
        console.error(error);
        return DeletePostError.DELETE_FAILED;
    }
};
