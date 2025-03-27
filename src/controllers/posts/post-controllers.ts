import { getPagination } from "../../extras/pagination";
import { prisma } from "../../extras/prisma";
import {
  DeletePostError,
  GetPostsError,
  PostStatus,
  type GetPostsResult,
  type PostCreateResult,
} from "./post-types";

export const createPost = async (parameters: {
    title: string;
    content: string;
    authorId: string | undefined; // user id from token or session
  }): Promise<PostCreateResult | PostStatus> => {
    try {
      if (!parameters.authorId) {
        return PostStatus.USER_NOT_FOUND;
      }
  
      const post = await prisma.post.create({
        data: {
          title: parameters.title,
          content: parameters.content,
          user: {
            connect: {
              id: parameters.authorId
          }
          },
        },
      });
  
      return { post };
    } catch (error) {
      console.error(error);
      return PostStatus.POST_CREATION_FAILED;
    }
  };