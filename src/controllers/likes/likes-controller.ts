import { prisma } from "../../extras/prisma";import type { Like } from "@prisma/client";
import { LikeStatus, DeleteLikeError,type CreateLikeResult,type GetLikesResult } from "./like-types";


export const createLike = async (postId: string, userId: string): Promise<CreateLikeResult> => {
    try {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        return { status: LikeStatus.POST_NOT_FOUND };
      }
  
      const existingLike = await prisma.like.findFirst({
        where: { userId, postId }, // Finds if the user has already liked the post
      });
  
      if (existingLike) {
        return { status: LikeStatus.ALREADY_LIKED };
      }
  
      await prisma.like.create({ data: { userId, postId } });
  
      return { status: LikeStatus.LIKE_SUCCESS };
    } catch (error) {
      console.error(error);
      return { status: LikeStatus.UNKNOWN };
    }
  };
  
