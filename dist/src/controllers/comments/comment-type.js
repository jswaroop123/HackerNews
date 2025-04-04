export var GetCommentsError;
(function (GetCommentsError) {
    GetCommentsError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetCommentsError["COMMENTS_NOT_FOUND"] = "COMMENTS_NOT_FOUND";
    GetCommentsError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetCommentsError["UNKNOWN"] = "UNKNOWN";
})(GetCommentsError || (GetCommentsError = {}));
export var CreateCommentError;
(function (CreateCommentError) {
    CreateCommentError["INVALID_INPUT"] = "INVALID_INPUT";
    CreateCommentError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    CreateCommentError["UNKNOWN"] = "UNKNOWN";
})(CreateCommentError || (CreateCommentError = {}));
export var UpdateCommentError;
(function (UpdateCommentError) {
    UpdateCommentError["INVALID_INPUT"] = "INVALID_INPUT";
    UpdateCommentError["COMMENT_NOT_FOUND"] = "COMMENT_NOT_FOUND";
    UpdateCommentError["NO_CHANGES"] = "NO_CHANGES";
    UpdateCommentError["UNAUTHORIZED"] = "UNAUTHORIZED";
    UpdateCommentError["UNKNOWN"] = "UNKNOWN";
})(UpdateCommentError || (UpdateCommentError = {}));
export var DeleteCommentError;
(function (DeleteCommentError) {
    DeleteCommentError["COMMENT_NOT_FOUND"] = "COMMENT_NOT_FOUND";
    DeleteCommentError["UNAUTHORIZED"] = "UNAUTHORIZED";
    DeleteCommentError["UNKNOWN"] = "UNKNOWN";
})(DeleteCommentError || (DeleteCommentError = {}));
