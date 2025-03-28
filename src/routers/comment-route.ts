import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";
import {
  GetComments,
  CreateComment,
  DeleteComment,
  UpdateComment,
} from "../controllers/comments/comment-controller";
import {
  GetCommentsError,
  CreateCommentError,
  UpdateCommentError,
  DeleteCommentError,
} from "../controllers/comments/comment-type";
import { getPagination } from "../extras/pagination";

export const commentsRoutes = new Hono();

commentsRoutes.post("/on/:postId", tokenMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("userId");
    const { content } = await c.req.json();
    const result = await CreateComment({ postId, userId, content });
    return c.json(result, 201);
  } catch (error) {
    if (error === CreateCommentError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === CreateCommentError.INVALID_INPUT) {
      return c.json({ error: "Comment content is required" }, 400);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

commentsRoutes.get("/on/:postId", tokenMiddleware, async (c) => {
    try {
      const postId = c.req.param("postId");
      const { page, limit } = getPagination(c);
      const result = await GetComments({ postId, page, limit });
      return c.json(result, 200);
    } catch (error) {
      if (error === GetCommentsError.POST_NOT_FOUND) {
        return c.json({ error: "Post not found" }, 404);
      }
      if (error === GetCommentsError.COMMENTS_NOT_FOUND) {
        return c.json({ error: "No comments found on this post" }, 404);
      }
      if (error === GetCommentsError.PAGE_BEYOND_LIMIT) {
        return c.json({ error: "No comments found on the requested page" }, 404);
      }
      return c.json({ error: "Unknown error" }, 500);
    }
  });

  commentsRoutes.patch("/:commentId", tokenMiddleware, async (c) => {
    try {
      const commentId = c.req.param("commentId");
      const userId = c.get("userId");
      const { content } = await c.req.json();
      const result = await UpdateComment({ commentId, userId, content });
      return c.json(result, 200);
    } catch (error) {
      if (error === UpdateCommentError.COMMENT_NOT_FOUND) {
        return c.json({ error: "Comment not found" }, 404);
      }
      if (error === UpdateCommentError.INVALID_INPUT) {
        return c.json({ error: "Comment content is required" }, 400);
      }
      if (error === UpdateCommentError.NO_CHANGES) {
        return c.json({ error: "No changes detected in comment content" }, 400);
      }
      if (error === UpdateCommentError.UNAUTHORIZED) {
        return c.json(
          { error: "You are not authorized to edit this comment" },
          403
        );
      }
      return c.json({ error: "Unknown error" }, 500);
    }
  });

  commentsRoutes.delete("/:commentId", tokenMiddleware, async (c) => {
    try {
      const commentId = c.req.param("commentId");
      const userId = c.get("userId");
      await DeleteComment({ commentId, userId });
      return c.json({ message: "Comment deleted successfully" }, 200);
    } catch (error) {
      if (error === DeleteCommentError.COMMENT_NOT_FOUND) {
        return c.json({ error: "Comment not found" }, 404);
      }
      if (error === DeleteCommentError.UNAUTHORIZED) {
        return c.json({ error: "You can only delete your own comments" }, 403);
      }
      return c.json({ error: "Unknown error" },500);
    }
  });
  
  