import { Hono } from "hono";
import { createLike } from "../controllers/likes/likes-controller";
import { tokenMiddleware } from "./middleware/token-middleware";
import { LikeStatus } from "../controllers/likes/like-types";

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
    } catch (error) {
      console.error(error);
      return context.json({ error: "Unknown error" }, 500);
    }
  });