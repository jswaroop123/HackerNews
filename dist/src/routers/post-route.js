"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRoutes = void 0;
const hono_1 = require("hono");
const token_middleware_1 = require("./middleware/token-middleware");
const post_controllers_1 = require("../controllers/posts/post-controllers");
const post_types_1 = require("../controllers/posts/post-types");
const pagination_1 = require("../extras/pagination");
const post_controllers_2 = require("../controllers/posts/post-controllers");
exports.postsRoutes = new hono_1.Hono();
exports.postsRoutes.post("/create", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId"); //From tokenMiddleware
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const { title, content } = await context.req.json(); // Removed userId from here
        if (!title || !content) {
            return context.json({ error: "Title and Content are required" }, 400);
        }
        const result = await (0, post_controllers_1.createPost)({
            title,
            content,
            authorId: userId, //Use authenticated userId only
        });
        if (result === post_types_1.PostStatus.USER_NOT_FOUND) {
            return context.json({ error: "User not found" }, 404);
        }
        if (result === post_types_1.PostStatus.POST_CREATION_FAILED) {
            return context.json({ error: "Post creation failed" }, 500);
        }
        return context.json(result, 201); //  Post created
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Server error" }, 500);
    }
});
exports.postsRoutes.get("/me", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId"); // From tokenMiddleware
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, post_controllers_2.GetAllPostsForUser)({ userId, page, limit });
        return context.json(result, 200);
    }
    catch (error) {
        console.error(error);
        if (error === post_types_1.GetPostsError.NO_POSTS_FOUND) {
            return context.json({ error: "Posts not found" }, 404);
        }
        if (error === post_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No posts found on the requested page" }, 404);
        }
        return context.json({ error: "Unknown error" }, 500);
    }
});
exports.postsRoutes.get("/all", async (context) => {
    try {
        const { page, limit } = (0, pagination_1.getPagination)(context);
        const result = await (0, post_controllers_2.GetAllPosts)({ page, limit });
        return context.json(result, 200);
    }
    catch (error) {
        console.error(error);
        if (error === post_types_1.GetPostsError.NO_POSTS_FOUND) {
            return context.json({ error: "Posts not found" }, 404);
        }
        if (error === post_types_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No posts found on the requested page" }, 404);
        }
        return context.json({ error: "Unknown error" }, 500);
    }
});
exports.postsRoutes.delete("/:id", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const userId = context.get("userId"); // Extracted from tokenMiddleware
        const postId = context.req.param("id");
        if (!userId) {
            return context.json({ error: "Unauthorized" }, 401);
        }
        const result = await (0, post_controllers_2.deletePost)({ postId, userId });
        // Handle errors based on DeletePostError enum
        if (result === post_types_1.DeletePostError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result === post_types_1.DeletePostError.UNAUTHORIZED) {
            return context.json({ error: "You are not allowed to delete this post" }, 403);
        }
        if (result === post_types_1.DeletePostError.DELETE_FAILED) {
            return context.json({ error: "Failed to delete post" }, 500);
        }
        return context.json({ message: "Post deleted successfully" }, 200);
    }
    catch (error) {
        console.error("Unexpected error:", error);
        return context.json({ error: "Internal server error" }, 500);
    }
});
