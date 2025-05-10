import { Hono } from "hono";
import {
  authenticationMiddleware,
  type SecureSession,
} from "../middleware/session-middleware";
import {
  GetLikes,
  CreateLike,
  DeleteLike,
  GetLikesOnMe,
  GetLikesOnUser,
} from "./likes-controllers";
import {
  DeleteLikeError,
  GetLikesError,
  GetLikesOnMeError,
  LikePostError,
  GetLikesOnUserError,
} from "./likes-types";
import { getPagination } from "../../extras/pagenation";

export const likesRoutes = new Hono<SecureSession>();

likesRoutes.get("/on/:postId", async (c) => {
  try {
    const postId = c.req.param("postId");
    const { page, limit } = getPagination(c);
    const result = await GetLikes({ postId, page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetLikesError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === GetLikesError.LIKES_NOT_FOUND) {
      return c.json({ error: "No likes found on this post" }, 404);
    }
    if (error === GetLikesError.PAGE_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.post("/on/:postId", authenticationMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user").id;
    const result = await CreateLike({ postId, userId });
    return c.json(result, 201);
  } catch (error) {
    if (error === LikePostError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === LikePostError.ALREADY_LIKED) {
      return c.json({ error: "You have already liked this post" }, 400);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.delete("/on/:postId", authenticationMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user").id;
    const result = await DeleteLike({ postId, userId });
    return c.json(result, 200);
  } catch (error) {
    if (error === DeleteLikeError.POST_NOT_FOUND) {
      return c.json({ error: "Post not found" }, 404);
    }
    if (error === DeleteLikeError.LIKE_NOT_FOUND) {
      return c.json({ error: "Like not found" }, 404);
    }
    if (error === DeleteLikeError.USER_NOT_FOUND) {
      return c.json({ error: "You can only remove your own likes" }, 403);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.get("/me", authenticationMiddleware, async (c) => {
  try {
    const userId = c.get("user")?.id;
    const result = await GetLikesOnMe({ userId });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetLikesOnMeError.LIKES_NOT_FOUND) {
      return c.json({ error: "No likes found" }, 404);
    }
    if (error === GetLikesOnMeError.PAGE_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    if (error === GetLikesOnMeError.USER_NOT_FOUND) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({ error: "Unknown error" }, 500);
  }
});

likesRoutes.get("/by/:slug", async (c) => {
  try {
    const { slug } = c.req.param();
    const { page, limit } = getPagination(c);
    const result = await GetLikesOnUser({ name: slug, page, limit });
    return c.json(result, 200);
  } catch (error) {
    if (error === GetLikesOnMeError.LIKES_NOT_FOUND) {
      return c.json({ error: "No likes found for this user" }, 404);
    }
    if (error === GetLikesOnUserError.USER_NOT_FOUND) {
      return c.json({ error: "User not found" }, 404);
    }
    if (error === GetLikesOnUserError.PAGE_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    if (error === GetLikesOnUserError.POST_NOT_FOUND) {
      return c.json({ error: "No likes found on the requested page" }, 404);
    }
    return c.json({ error: "Unknown error!" }, 500);
  }
});