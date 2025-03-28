import { prisma } from "../../extras/prisma";
import {
  GetCommentsError,
  CreateCommentError,
  type GetCommentsResult,
  type CreateCommentResult,
  DeleteCommentError,
  UpdateCommentError,
  type UpdateCommentResult,
} from "./comment-type";

export const CreateComment = async (parameters: {
  postId: string;
  userId: string;
  content: string;
}): Promise<CreateCommentResult> => {
  try {
    const { postId, userId, content } = parameters;

    if (!content.trim()) {
      throw CreateCommentError.INVALID_INPUT;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw CreateCommentError.POST_NOT_FOUND;
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });

    return { comment };
  } catch (e) {
    console.error(e);
    if (
      e === CreateCommentError.POST_NOT_FOUND ||
      e === CreateCommentError.INVALID_INPUT
    ) {
      throw e;
    }
    throw CreateCommentError.UNKNOWN;
  }
};


