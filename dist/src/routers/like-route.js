import { Hono } from "hono";
import { getLikes, createLike, deleteLike } from "../controllers/likes/likes-controller";
import { tokenMiddleware } from "./middleware/token-middleware";
import { LikeStatus, DeleteLikeError } from "../controllers/likes/like-types";
import { getPagination } from "../extras/pagination";
export const likesRoutes = new Hono();
likesRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId"); // Extracted from tokenMiddleware
        const result = await createLike(postId, userId);
        if (result.status === LikeStatus.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result.status === LikeStatus.ALREADY_LIKED) {
            return context.json({ message: "Already liked" }, 200);
        }
        return context.json({ message: "Like added successfully" }, 201);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Unknown error" }, 500);
    }
});
likesRoutes.get("/on/:postId", tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const page = parseInt(context.req.query("page") || "1", 10);
        const limit = parseInt(context.req.query("limit") || "10", 10);
        const offset = (page - 1) * limit;
        const result = await getLikes({ postId, page, limit });
        if ("status" in result) {
            if (result.status === LikeStatus.NO_LIKES_FOUND) {
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
likesRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
    try {
        const postId = context.req.param("postId");
        const userId = context.get("userId"); // Extracted from tokenMiddleware
        const result = await deleteLike({ postId, userId });
        if (result.status === DeleteLikeError.POST_NOT_FOUND) {
            return context.json({ error: "Post not found" }, 404);
        }
        if (result.status === DeleteLikeError.LIKE_NOT_FOUND) {
            return context.json({ error: "Like not found" }, 404);
        }
        if (result.status === DeleteLikeError.UNAUTHORIZED) {
            return context.json({ error: "Unauthorized" }, 403);
        }
        if (result.status === DeleteLikeError.DELETE_FAILED) {
            return context.json({ error: "Failed to delete like" }, 500);
        }
        return context.json({ message: "Like deleted successfully" }, 200);
    }
    catch (error) {
        console.error(error);
        return context.json({ error: "Unknown error" }, 500);
    }
});
