"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRoutes = void 0;
const hono_1 = require("hono");
const likes_controller_1 = require("../controllers/likes/likes-controller");
const token_middleware_1 = require("./middleware/token-middleware");
const like_types_1 = require("../controllers/likes/like-types");
exports.likesRoutes = new hono_1.Hono();
exports.likesRoutes.post("/on/:postId", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId"); // Extracted from tokenMiddleware
        const result = await (0, likes_controller_1.createLike)(postId, userId);
        if (result.status === like_types_1.LikeStatus.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result.status === like_types_1.LikeStatus.ALREADY_LIKED) {
            return context.json({ message: "Already liked" }, 200);
        }
        return context.json({ message: "Like added successfully" }, 201);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.get("/on/:postId", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const page = parseInt(context.req.query("page") || "1", 10);
        const limit = parseInt(context.req.query("limit") || "10", 10);
        const offset = (page - 1) * limit;
        const result = await (0, likes_controller_1.getLikes)({ postId, page, limit });
        if ("status" in result) {
            if (result.status === like_types_1.LikeStatus.NO_LIKES_FOUND) {
                return context.json({ error: "No likes found" }, 404);
            }
            return context.json({ error: "Unknown error" }, 500);
        }
        return context.json({ likes: result.likes, page, limit }, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.delete("/on/:postId", token_middleware_1.tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId"); // Extracted from tokenMiddleware
        const result = await (0, likes_controller_1.deleteLike)({ postId, userId });
        if (result.status === like_types_1.DeleteLikeError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result.status === like_types_1.DeleteLikeError.LIKE_NOT_FOUND) {
            return context.json({ error: "Like not found" }, 404);
        }
        if (result.status === like_types_1.DeleteLikeError.UNAUTHORIZED) {
            return context.json({ error: "Unauthorized" }, 403);
        }
        if (result.status === like_types_1.DeleteLikeError.DELETE_FAILED) {
            return context.json({ error: "Failed to delete like" }, 500);
        }
        return context.json({ message: "Like deleted successfully" }, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Unknown error" }, 500);
    }
});
