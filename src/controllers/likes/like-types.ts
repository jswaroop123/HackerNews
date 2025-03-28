import  type {Like} from "@prisma/client";

export enum LikeStatus {
    ALREADY_LIKED = "ALREADY_LIKED",
    LIKE_SUCCESS = "LIKE_SUCCESS",
    UNKNOWN = "UNKNOWN",
    POST_NOT_FOUND = "POST_NOT_FOUND",
    NO_LIKES_FOUND = "NO_LIKES_FOUND",
    LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
    LIKE_DELETED = "LIKE_DELETED",
  }



export type CreateLikeResult =
{ 
    status: LikeStatus
}
  

export type GetLikesResult = {
    likes: {
      id: string;
      createdAt: Date;
      user: {
        id: string;
        username: string;
      };
    }[];
  };

export enum DeleteLikeError {
    UNAUTHORIZED = "UNAUTHORIZED",
    LIKE_NOT_FOUND = "LIKE_NOT_FOUND",
    DELETE_SUCCESS = "DELETE_SUCCESS",
    DELETE_FAILED = "DELETE_FAILED",
    UNKNOWN = "UNKNOWN",
}