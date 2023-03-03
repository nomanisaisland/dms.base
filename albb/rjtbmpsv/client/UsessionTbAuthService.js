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
var RandomUtil_1 = require("../../../value/RandomUtil");
var cloudDbClient_1 = require("./cloudDbClient");
/**
 * 旧版，准备移除
 */
var UsessionService = /** @class */ (function () {
    function UsessionService() {
    }
    /**
     * 获取用户信息，失败即是没有授权，申请授权后再去获取用户信息；
     * 用户拒绝授权时，提示必须授权才能使用，去授权：重复获取授权直到得到授权为止，否：退出小程序
     */
    UsessionService.prototype.tbAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authUser, ex_1, auth, authUser, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 8]);
                        return [4 /*yield*/, rjMy_1.rjMy.getAuthUserInfo()];
                    case 1:
                        authUser = _a.sent();
                        return [2 /*return*/, authUser];
                    case 2:
                        ex_1 = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, rjMy_1.rjMy.authorize({
                                scopes: "scope.userInfo",
                            })];
                    case 4:
                        auth = _a.sent();
                        void auth;
                        return [4 /*yield*/, rjMy_1.rjMy.getAuthUserInfo()];
                    case 5:
                        authUser = _a.sent();
                        return [2 /*return*/, authUser];
                    case 6:
                        ex_2 = _a.sent();
                        // const confirmRes = await rjMy.confirm({
                        //     title: "提示",
                        //     content: "必须授权才可以使用",
                        //     confirmButtonText: "去授权",
                        //     cancelButtonText: "退出",
                        // });
                        // if (confirmRes.confirm) {
                        //     return await this.tbAuth();
                        // }
                        // rjMy.exit();
                        // throw ex;
                        rjMy_1.rjMy.showToast({
                            content: "获取授权失败，部分功能需要权限，请前往首页右上角授权设置进行授权！"
                        });
                        throw new Error("获取获取授权失败");
                    case 7: return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UsessionService.prototype.detailTbAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authUser, user, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tbAuth()];
                    case 1:
                        authUser = _a.sent();
                        return [4 /*yield*/, cloudDbClient_1.cloudDbClient.collection("user").find({
                                tbNickName: authUser.nickName,
                            })];
                    case 2:
                        user = (_a.sent())[0];
                        if (!!user) return [3 /*break*/, 4];
                        id = RandomUtil_1.RandomUtil.guidStringN();
                        user = {
                            _id: id,
                            id: id,
                            tbNickName: authUser.nickName,
                            avatar: authUser.avatar,
                            addTime: Date.now(),
                        };
                        return [4 /*yield*/, cloudDbClient_1.cloudDbClient.collection("user").insertOne(user)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, user];
                }
            });
        });
    };
    return UsessionService;
}());
exports.UsessionService = UsessionService;
