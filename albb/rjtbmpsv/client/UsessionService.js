"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsessionService = void 0;
var rjMy_1 = require("../../rjMy");
var TbmpcloudClient_1 = require("./TbmpcloudClient");
/**
 * 淘宝小程序适用的用户会话
 */
var UsessionService = /** @class */ (function () {
    function UsessionService() {
        this.detailPromise = undefined;
        this.tbAuthUserPromise = undefined;
        this.detailAuthLoaded = false;
    }
    /**
     * 获取用户信息，失败即是没有授权，申请授权后再去获取用户信息；
     * 用户拒绝授权时，提示必须授权才能使用，去授权：重复获取授权直到得到授权为止，否：退出小程序
     */
    UsessionService.prototype.tbAuthUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!this.tbAuthUserPromise) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.tbAuthUserPromise];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        this.tbAuthUserPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var i, authUser, ex_1, auth, authUser, error_1, ex_2, systemInfo_1, confirmRes, systemInfo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        i = 1;
                                        _a.label = 1;
                                    case 1:
                                        if (!(i <= 1)) return [3 /*break*/, 18];
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 17]);
                                        return [4 /*yield*/, rjMy_1.rjMy.getAuthUserInfo()];
                                    case 3:
                                        authUser = _a.sent();
                                        return [2 /*return*/, authUser];
                                    case 4:
                                        ex_1 = _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        _a.trys.push([5, 11, , 16]);
                                        return [4 /*yield*/, rjMy_1.rjMy.authorize({
                                                scopes: "scope.userInfo",
                                            })];
                                    case 6:
                                        auth = _a.sent();
                                        void auth;
                                        _a.label = 7;
                                    case 7:
                                        _a.trys.push([7, 9, , 10]);
                                        return [4 /*yield*/, rjMy_1.rjMy.getAuthUserInfo()];
                                    case 8:
                                        authUser = _a.sent();
                                        return [2 /*return*/, authUser];
                                    case 9:
                                        error_1 = _a.sent();
                                        //不一定会成功，牵牛子账号获取不到用户信息
                                        console.error(error_1);
                                        return [2 /*return*/, undefined];
                                    case 10: return [3 /*break*/, 16];
                                    case 11:
                                        ex_2 = _a.sent();
                                        return [4 /*yield*/, rjMy_1.rjMy.getSystemInfo()];
                                    case 12:
                                        systemInfo_1 = _a.sent();
                                        if (!(!systemInfo_1 || systemInfo_1.model == "千牛")) return [3 /*break*/, 14];
                                        return [4 /*yield*/, rjMy_1.rjMy.confirm({
                                                title: "提示",
                                                content: "必须授权才可以使用",
                                                confirmButtonText: "去授权",
                                                cancelButtonText: "退出",
                                            })];
                                    case 13:
                                        confirmRes = _a.sent();
                                        if (!confirmRes.confirm) {
                                            rjMy_1.rjMy.exit();
                                        }
                                        return [3 /*break*/, 15];
                                    case 14:
                                        rjMy_1.rjMy.showToast({
                                            content: "当前应用需要点击右上角授权才可以体验完整功能"
                                        });
                                        throw new Error('授权失败');
                                    case 15: return [3 /*break*/, 16];
                                    case 16: return [3 /*break*/, 17];
                                    case 17:
                                        i++;
                                        return [3 /*break*/, 1];
                                    case 18: return [4 /*yield*/, rjMy_1.rjMy.getSystemInfo()];
                                    case 19:
                                        systemInfo = _a.sent();
                                        if (!systemInfo || systemInfo.model == "千牛") {
                                            rjMy_1.rjMy.alert({
                                                title: "授权失败",
                                                content: "必须授权才能使用；首次使用必须要主账号登录授权"
                                            });
                                            throw new Error('授权失败');
                                        }
                                        else {
                                            rjMy_1.rjMy.showToast({
                                                content: "获取授权失败，后续可在右上角授权中心重新授权！"
                                            });
                                            throw new Error('授权失败');
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [4 /*yield*/, this.tbAuthUserPromise];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 当前用户信息，非完整信息，不一定包含用户名
     */
    UsessionService.prototype.detailTbUnauth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!this.detailPromise) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.detailPromise];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        this.detailPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var tbAuthUser, detail;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.tbAuthUserPromise];
                                    case 1:
                                        tbAuthUser = (_a.sent()) || {};
                                        return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", {
                                                tbNickName: tbAuthUser.nickName,
                                                tbAvatar: tbAuthUser.avatar,
                                            }, "usessionDetailTb")];
                                    case 2:
                                        detail = _a.sent();
                                        return [2 /*return*/, detail];
                                }
                            });
                        }); })();
                        return [4 /*yield*/, this.detailPromise];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsessionService.prototype.refresh = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.detailPromise = undefined;
                        return [4 /*yield*/, this.detailTbUnauth()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 当前授权用户，完整信息，包含用户名
     */
    UsessionService.prototype.detailAuthTb = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var tbAuthUser, detail;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!!this.detailAuthLoaded) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.detailTbUnauth()];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        this.detailAuthLoaded = true;
                        return [4 /*yield*/, this.tbAuthUser()];
                    case 3:
                        tbAuthUser = (_c.sent()) || {};
                        if (!!!this.detailPromise) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.detailPromise];
                    case 4:
                        detail = _c.sent();
                        if (!!tbAuthUser.nickName && ((_a = detail.visitor) === null || _a === void 0 ? void 0 : _a.tbNickName) !== tbAuthUser.nickName ||
                            !!tbAuthUser.tbAvatar && ((_b = detail.visitor) === null || _b === void 0 ? void 0 : _b.tbAvatar) !== tbAuthUser.avatar) {
                            //测试之前的请求，如果不存在用户信息的话，刷新
                            this.detailPromise = undefined;
                        }
                        _c.label = 5;
                    case 5: return [4 /*yield*/, this.detailTbUnauth()];
                    case 6: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    UsessionService.prototype.detailTb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.detailAuthTb()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 检查用户是否又置顶权限
     */
    UsessionService.prototype.permitCheck = function (usession, permitKey, permitsStrOnly) {
        var _a, _b, _c;
        //权限字段有值
        return ("," + (((_a = usession === null || usession === void 0 ? void 0 : usession.user) === null || _a === void 0 ? void 0 : _a.permitsStr) || "") + ",").includes("," + permitKey + ",") ||
            //用户是店主账号
            !permitsStrOnly && (((_b = usession === null || usession === void 0 ? void 0 : usession.user) === null || _b === void 0 ? void 0 : _b.tbNickName) || "bad1") === (((_c = usession.shop) === null || _c === void 0 ? void 0 : _c.tbNickName) || "bad2");
    };
    return UsessionService;
}());
exports.UsessionService = UsessionService;
