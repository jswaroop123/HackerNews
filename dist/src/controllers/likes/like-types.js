"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLikeError = exports.LikeStatus = void 0;
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["ALREADY_LIKED"] = "ALREADY_LIKED";
    LikeStatus["LIKE_SUCCESS"] = "LIKE_SUCCESS";
    LikeStatus["UNKNOWN"] = "UNKNOWN";
    LikeStatus["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    LikeStatus["NO_LIKES_FOUND"] = "NO_LIKES_FOUND";
    LikeStatus["LIKE_NOT_FOUND"] = "LIKE_NOT_FOUND";
    LikeStatus["LIKE_DELETED"] = "LIKE_DELETED";
})(LikeStatus || (exports.LikeStatus = LikeStatus = {}));
var DeleteLikeError;
(function (DeleteLikeError) {
    DeleteLikeError["UNAUTHORIZED"] = "UNAUTHORIZED";
    DeleteLikeError["LIKE_NOT_FOUND"] = "LIKE_NOT_FOUND";
    DeleteLikeError["DELETE_SUCCESS"] = "DELETE_SUCCESS";
    DeleteLikeError["DELETE_FAILED"] = "DELETE_FAILED";
    DeleteLikeError["UNKNOWN"] = "UNKNOWN";
    DeleteLikeError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
})(DeleteLikeError || (exports.DeleteLikeError = DeleteLikeError = {}));
