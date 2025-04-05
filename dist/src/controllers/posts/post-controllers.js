"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.GetAllPosts = exports.GetAllPostsForUser = exports.createPost = void 0;
const prisma_1 = require("../../extras/prisma");
const post_types_1 = require("./post-types");
const createPost = async (parameters) => {
    try {
        if (!parameters.authorId) {
            return post_types_1.PostStatus.USER_NOT_FOUND;
        }
        const post = await prisma_1.prisma.post.create({
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
        return post_types_1.PostStatus.POST_CREATION_FAILED;
    }
};
exports.createPost = createPost;
const GetAllPostsForUser = async (parameter) => {
    try {
        const { userId, page, limit } = parameter;
        const skip = (page - 1) * limit;
        const userExists = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw post_types_1.GetPostsError.USER_NOT_FOUND;
        }
        // Then, check if the user has any posts
        const totalPosts = await prisma_1.prisma.post.count({ where: { userId } });
        if (totalPosts === 0) {
            throw post_types_1.GetPostsError.NO_POSTS_FOUND;
        }
        // Check if the requested page exists
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw post_types_1.GetPostsError.PAGE_BEYOND_LIMIT;
        }
        // Fetch the posts
        const posts = await prisma_1.prisma.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });
        return { posts };
    }
    catch (e) {
        console.error(e);
        if (e === post_types_1.GetPostsError.USER_NOT_FOUND ||
            e === post_types_1.GetPostsError.NO_POSTS_FOUND ||
            e === post_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw post_types_1.GetPostsError.UNKNOWN;
    }
};
exports.GetAllPostsForUser = GetAllPostsForUser;
const GetAllPosts = async (parameter) => {
    try {
        const { page, limit } = parameter;
        const skip = (page - 1) * limit;
        // Count total posts
        const totalPosts = await prisma_1.prisma.post.count();
        if (totalPosts === 0) {
            throw post_types_1.GetPostsError.NO_POSTS_FOUND;
        }
        // Check if the requested page exists
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw post_types_1.GetPostsError.PAGE_BEYOND_LIMIT;
        }
        // Fetch all posts
        const posts = await prisma_1.prisma.post.findMany({
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
        if (e === post_types_1.GetPostsError.NO_POSTS_FOUND || e === post_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw post_types_1.GetPostsError.UNKNOWN;
    }
};
exports.GetAllPosts = GetAllPosts;
const deletePost = async (params) => {
    try {
        // Check if the post belongs to the user
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: params.postId },
        });
        if (!post) {
            return post_types_1.DeletePostError.POST_NOT_FOUND;
        }
        if (post.userId !== params.userId) {
            return post_types_1.DeletePostError.UNAUTHORIZED;
        }
        await prisma_1.prisma.post.delete({
            where: { id: params.postId },
        });
        return post_types_1.DeletePostError.DELETE_SUCCESS;
    }
    catch (error) {
        console.error(error);
        return post_types_1.DeletePostError.DELETE_FAILED;
    }
};
exports.deletePost = deletePost;
