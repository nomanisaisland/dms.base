"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packBuildUrl = exports.packUrl = void 0;
function packUrl(moduleName, path) {
    if (path === void 0) { path = ""; }
    return "/".concat(moduleName, "/").concat(path);
}
exports.packUrl = packUrl;
function packBuildUrl(moduleName, path) {
    if (path === void 0) { path = ""; }
    return "/".concat(moduleName, "/build/").concat(path);
}
exports.packBuildUrl = packBuildUrl;
