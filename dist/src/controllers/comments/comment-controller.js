"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteComment = exports.UpdateComment = exports.GetComments = exports.CreateComment = void 0;
const prisma_1 = require("../../extras/prisma");
const comment_type_1 = require("./comment-type");
const CreateComment = async (parameters) => {
    try {
        const { postId, userId, content } = parameters;
        if (!content.trim()) {
            throw comment_type_1.CreateCommentError.INVALID_INPUT;
        }
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw comment_type_1.CreateCommentError.POST_NOT_FOUND;
        }
        const comment = await prisma_1.prisma.comment.create({
            data: {
                content,
                postId,
                userId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { comment };
    }
    catch (e) {
        console.error(e);
        if (e === comment_type_1.CreateCommentError.POST_NOT_FOUND ||
            e === comment_type_1.CreateCommentError.INVALID_INPUT) {
            throw e;
        }
        throw comment_type_1.CreateCommentError.UNKNOWN;
    }
};
exports.CreateComment = CreateComment;
const GetComments = async (parameters) => {
    try {
        const { postId, page, limit } = parameters;
        if (page < 1 || limit < 1) {
            throw comment_type_1.GetCommentsError.PAGE_BEYOND_LIMIT;
        }
        const skip = (page - 1) * limit;
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw comment_type_1.GetCommentsError.POST_NOT_FOUND;
        }
        const totalComments = await prisma_1.prisma.comment.count({
            where: { postId },
        });
        if (totalComments === 0) {
            throw comment_type_1.GetCommentsError.COMMENTS_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalComments / limit);
        if (page > totalPages) {
            throw comment_type_1.GetCommentsError.PAGE_BEYOND_LIMIT;
        }
        const comments = await prisma_1.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { comments };
    }
    catch (e) {
        console.error(e);
        if (e === comment_type_1.GetCommentsError.POST_NOT_FOUND ||
            e === comment_type_1.GetCommentsError.COMMENTS_NOT_FOUND ||
            e === comment_type_1.GetCommentsError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw comment_type_1.GetCommentsError.UNKNOWN;
    }
};
exports.GetComments = GetComments;
const UpdateComment = async (parameters) => {
    try {
        const { commentId, userId, content } = parameters;
        if (!content.trim()) {
            throw comment_type_1.UpdateCommentError.INVALID_INPUT;
        }
        const existingComment = await prisma_1.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment) {
            throw comment_type_1.UpdateCommentError.COMMENT_NOT_FOUND;
        }
        if (existingComment.userId !== userId) {
            throw comment_type_1.UpdateCommentError.UNAUTHORIZED;
        }
        if (existingComment.content.toLowerCase().trim() ===
            content.toLowerCase().trim()) {
            throw comment_type_1.UpdateCommentError.NO_CHANGES;
        }
        const comment = await prisma_1.prisma.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { comment };
    }
    catch (e) {
        console.error(e);
        if (e === comment_type_1.UpdateCommentError.COMMENT_NOT_FOUND ||
            e === comment_type_1.UpdateCommentError.INVALID_INPUT ||
            e === comment_type_1.UpdateCommentError.NO_CHANGES ||
            e === comment_type_1.UpdateCommentError.UNAUTHORIZED) {
            throw e;
        }
        throw comment_type_1.UpdateCommentError.UNKNOWN;
    }
};
exports.UpdateComment = UpdateComment;
const DeleteComment = async (parameters) => {
    try {
        const { commentId, userId } = parameters;
        const comment = await prisma_1.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw comment_type_1.DeleteCommentError.COMMENT_NOT_FOUND;
        }
        if (comment.userId !== userId) {
            throw comment_type_1.DeleteCommentError.UNAUTHORIZED;
        }
        await prisma_1.prisma.comment.delete({
            where: { id: commentId },
        });
    }
    catch (e) {
        console.error(e);
        if (e === comment_type_1.DeleteCommentError.COMMENT_NOT_FOUND ||
            e === comment_type_1.DeleteCommentError.UNAUTHORIZED) {
            throw e;
        }
        throw comment_type_1.DeleteCommentError.UNKNOWN;
    }
};
exports.DeleteComment = DeleteComment;
