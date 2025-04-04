"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRoutes = void 0;
const hono_1 = require("hono");
const token_middleware_1 = require("./middleware/token-middleware");
const comment_controller_1 = require("../controllers/comments/comment-controller");
const comment_type_1 = require("../controllers/comments/comment-type");
const pagination_1 = require("../extras/pagination");
exports.commentsRoutes = new hono_1.Hono();
exports.commentsRoutes.post("/on/:postId", token_middleware_1.tokenMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("userId");
        const { content } = await c.req.json();
        const result = await (0, comment_controller_1.CreateComment)({ postId, userId, content });
        return c.json(result, 201);
    }
    catch (error) {
        if (error === comment_type_1.CreateCommentError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === comment_type_1.CreateCommentError.INVALID_INPUT) {
            return c.json({ error: "Comment content is required" }, 400);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.get("/on/:postId", token_middleware_1.tokenMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const { page, limit } = (0, pagination_1.getPagination)(c);
        const result = await (0, comment_controller_1.GetComments)({ postId, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comment_type_1.GetCommentsError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === comment_type_1.GetCommentsError.COMMENTS_NOT_FOUND) {
            return c.json({ error: "No comments found on this post" }, 404);
        }
        if (error === comment_type_1.GetCommentsError.PAGE_BEYOND_LIMIT) {
            return c.json({ error: "No comments found on the requested page" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.patch("/:commentId", token_middleware_1.tokenMiddleware, async (c) => {
    try {
        const commentId = c.req.param("commentId");
        const userId = c.get("userId");
        const { content } = await c.req.json();
        const result = await (0, comment_controller_1.UpdateComment)({ commentId, userId, content });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === comment_type_1.UpdateCommentError.COMMENT_NOT_FOUND) {
            return c.json({ error: "Comment not found" }, 404);
        }
        if (error === comment_type_1.UpdateCommentError.INVALID_INPUT) {
            return c.json({ error: "Comment content is required" }, 400);
        }
        if (error === comment_type_1.UpdateCommentError.NO_CHANGES) {
            return c.json({ error: "No changes detected in comment content" }, 400);
        }
        if (error === comment_type_1.UpdateCommentError.UNAUTHORIZED) {
            return c.json({ error: "You are not authorized to edit this comment" }, 403);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.commentsRoutes.delete("/:commentId", token_middleware_1.tokenMiddleware, async (c) => {
    try {
        const commentId = c.req.param("commentId");
        const userId = c.get("userId");
        await (0, comment_controller_1.DeleteComment)({ commentId, userId });
        return c.json({ message: "Comment deleted successfully" }, 200);
    }
    catch (error) {
        if (error === comment_type_1.DeleteCommentError.COMMENT_NOT_FOUND) {
            return c.json({ error: "Comment not found" }, 404);
        }
        if (error === comment_type_1.DeleteCommentError.UNAUTHORIZED) {
            return c.json({ error: "You can only delete your own comments" }, 403);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
