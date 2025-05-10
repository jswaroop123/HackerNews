import { Hono } from "hono";
import {
  authenticationMiddleware,
  type SecureSession,
} from "../middleware/session-middleware";
import {
  GetComments,
  CreateComment,
  DeleteComment,
  UpdateComment,
  GetCommentsOnPosts,
  GetCommentsOnMe,
  GetCommentsOnUser,
} from "./comments-controllers";
import {
  GetCommentsError,
  CreateCommentError,
  UpdateCommentError,
  DeleteCommentError,
  GetCommentsOnPostsError,
  GetCommentsOnMeError,
  GetCommentsOnUserError,
} from "./comments-types";
import { getPagination } from "../../extras/pagenation";
export const commentsRoutes = new Hono<SecureSession>();

commentsRoutes.get("/on/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const { page, limit } = getPagination(c);
    const result = await GetComments({ postId, page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetCommentsError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === GetCommentsError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No comments found on the requested page" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

commentsRoutes.post("/on/:postId", authenticationMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user").id;
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

commentsRoutes.patch("/:commentId", authenticationMiddleware, async (c) => {
  try {
    const commentId = c.req.param("commentId");
    const userId = c.get("user").id;
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

commentsRoutes.delete("/:commentId", authenticationMiddleware, async (c) => {
  try {
    const commentId = c.req.param("commentId");
    const userId = c.get("user").id;
    await DeleteComment({ commentId, userId });
    return c.json({ message: "Comment deleted successfully" }, 200);
  } catch (error) {
    if (error === DeleteCommentError.COMMENT_NOT_FOUND) {
      return c.json({ error: "Comment not found" }, 404);
    }
    if (error === DeleteCommentError.UNAUTHORIZED) {
      return c.json({ error: "You can only delete your own comments" }, 403);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

commentsRoutes.get("/on/posts", async (c) => {
  try {
    const { page, limit } = getPagination(c);
    const result = await GetCommentsOnPosts({ page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetCommentsOnPostsError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No comments found on the requested page" }, 404);
    }
    if (error === GetCommentsOnPostsError.COMMENTS_NOT_FOUND) {
      return c.json({ error: "No comments found" }, 404);
    }
    if (error === GetCommentsOnPostsError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

commentsRoutes.get("/me", authenticationMiddleware, async (c) => {
  try {
    const userId = c.get("user")?.id;
    const result = await GetCommentsOnMe({ userId });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetCommentsOnMeError.COMMENTS_NOT_FOUND) {
      return c.json({ error: "No comments found" }, 404);
    }
    if (error === GetCommentsOnMeError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No comments found on the requested page" }, 404);
    }
    if (error === GetCommentsOnMeError.USER_NOT_FOUND) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

commentsRoutes.get("/by/:slug", async (c) => {
  try {
    const { slug } = c.req.param();
    const { page, limit } = getPagination(c);
    const result = await GetCommentsOnUser({ name: slug, page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetCommentsOnMeError.COMMENTS_NOT_FOUND) {
      return c.json({ error: "No comments found for this user" }, 404);
    }
    if (error === GetCommentsOnMeError.PAGE_BEYOND_LIMIT) {
      return c.json({ error: "No comments found on the requested page" }, 404);
    }
    if (error === GetCommentsOnMeError.USER_NOT_FOUND) {
      return c.json({ error: "User not found" }, 404);
    }
    if (error === GetCommentsOnUserError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});