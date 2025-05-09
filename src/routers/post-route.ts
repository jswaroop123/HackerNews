import { Hono } from "hono";
import { tokenMiddleware } from "./middleware/token-middleware";
import {createPost} from "../controllers/posts/post-controllers";
import {
  DeletePostError,
  GetPostsError,
  PostStatus,
} from "../controllers/posts/post-types";
import { sessionMiddleware } from "./middleware/session-middleware";
import { getPagination } from "../extras/pagination";
import {GetAllPostsForUser, GetAllPosts, deletePost} from "../controllers/posts/post-controllers"

export const postsRoutes = new Hono();

postsRoutes.post("/", sessionMiddleware, async (context) => {
  try {
    const userId = context.get("user").id; //From tokenMiddleware
    if (!userId) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const { title, content } = await context.req.json(); // Removed userId from here

    if (!title || !content) {
      return context.json({ error: "Title and Content are required" }, 400);
    }

    const result = await createPost({
      title,
      content,
      authorId: userId, //Use authenticated userId only
    });

    if (result === PostStatus.USER_NOT_FOUND) {
      return context.json({ error: "User not found" }, 404);
    }

    if (result === PostStatus.POST_CREATION_FAILED) {
      return context.json({ error: "Post creation failed" }, 500);
    }

    return context.json(result, 201); //  Post created
  } catch (error) {
    console.error(error);
    return context.json({ error: "Server error" }, 500);
  }
});


postsRoutes.get("/me", tokenMiddleware, async (context) => {
  try {
    const userId = context.get("userId"); // From tokenMiddleware
    if (!userId) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const { page, limit } = getPagination(context);

    const result = await GetAllPostsForUser({ userId, page, limit });

    return context.json(result, 200);
  } catch (error) {
    console.error(error);
    if (error === GetPostsError.NO_POSTS_FOUND) {
      return context.json({ error: "Posts not found" }, 404);
    }
    if (error === GetPostsError.PAGE_BEYOND_LIMIT) {
      return context.json({ error: "No posts found on the requested page" }, 404);
    }
    return context.json({ error: "Unknown error" }, 500);
  }
});

postsRoutes.get("/", async (context) => {
  try {
    const { page, limit } = getPagination(context);

    const result = await GetAllPosts({ page, limit });

    return context.json(result, 200);
  } catch (error) {
    console.error(error);
    if (error === GetPostsError.NO_POSTS_FOUND) {
      return context.json({ error: "Posts not found" }, 404);
    }
    if (error === GetPostsError.PAGE_BEYOND_LIMIT) {
      return context.json({ error: "No posts found on the requested page" }, 404);
    }
    return context.json({ error: "Unknown error" }, 500);
  }
});

postsRoutes.delete("/:id", tokenMiddleware, async (context) => {
  try {
    const userId = context.get("userId"); // Extracted from tokenMiddleware
    const postId = context.req.param("id");

    if (!userId) {
      return context.json({ error: "Unauthorized" }, 401);
    }

    const result = await deletePost({ postId, userId });

    // Handle errors based on DeletePostError enum
    if (result === DeletePostError.POST_NOT_FOUND) {
      return context.json({ error: "Post not found" }, 404);
    }

    if (result === DeletePostError.UNAUTHORIZED) {
      return context.json({ error: "You are not allowed to delete this post" }, 403);
    }

    if (result === DeletePostError.DELETE_FAILED) {
      return context.json({ error: "Failed to delete post" }, 500);
    }

    return context.json({ message: "Post deleted successfully" }, 200);
  } catch (error) {
    console.error("Unexpected error:", error);
    return context.json({ error: "Internal server error" }, 500);
  }
});


