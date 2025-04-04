"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsersError = exports.GetMeError = void 0;
var GetMeError;
(function (GetMeError) {
    GetMeError["UNKNOWN"] = "UNKNOWN";
    GetMeError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
})(GetMeError || (exports.GetMeError = GetMeError = {}));
var GetAllUsersError;
(function (GetAllUsersError) {
    GetAllUsersError["NO_USERS_FOUND"] = "NO_USERS_FOUND";
    GetAllUsersError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetAllUsersError["UNKNOWN"] = "UNKNOWN";
})(GetAllUsersError || (exports.GetAllUsersError = GetAllUsersError = {}));
