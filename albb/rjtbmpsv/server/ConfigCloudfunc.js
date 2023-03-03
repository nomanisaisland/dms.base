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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainExports = exports.inputToOutput = exports.exportsHandlers = exports.ConfigCloudfunc = void 0;
var RouteEnvConfig_1 = require("../../../pack/RouteEnvConfig");
var migrateApply_1 = require("../data/migrateApply");
/**
 * 配置信息，应由具体应用在运行时填入。
 */
exports.ConfigCloudfunc = RouteEnvConfig_1.RouteEnvConfig;
/**
 * 导出处理程序，包装注入切面。异常处理包装，自动数据迁移。
 */
function exportsHandlers(toExports, fromExports) {
    var e_1, _a;
    var fnKeys = Object.keys(fromExports).
        filter(function (k) { return typeof fromExports[k] == "function"; });
    var _loop_1 = function (fnKey) {
        if (!!toExports[fnKey]) {
            console.error("\u4E91\u51FD\u6570\u5904\u7406\u7A0B\u5E8F\u5BFC\u51FA\u91CD\u540D\u3002 ".concat(fnKey));
        }
        var fn = fromExports[fnKey];
        var wrapFn = function () {
            var _a, _b;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var error_1, result, error_2, errorMessage;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, migrateApply_1.migrateApply.apply(void 0, __spreadArray([], __read(args), false))];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _c.sent();
                            console.error(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [4 /*yield*/, fn.call.apply(fn, __spreadArray([this], __read(args), false))];
                        case 5:
                            result = _c.sent();
                            //额外补充上函数调用信息
                            if (typeof result == "object" && !!result) {
                                Object.assign(result, {
                                    cloudfuncsHandler: fnKey,
                                });
                            }
                            return [2 /*return*/, result];
                        case 6:
                            error_2 = _c.sent();
                            console.error(error_2);
                            errorMessage = String((_b = (_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.errorMessage) !== null && _a !== void 0 ? _a : error_2 === null || error_2 === void 0 ? void 0 : error_2.message) !== null && _b !== void 0 ? _b : error_2);
                            return [2 /*return*/, {
                                    cloudfuncsHandler: fnKey,
                                    error: errorMessage,
                                    errorMessage: errorMessage,
                                }];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        toExports[fnKey] = wrapFn;
    };
    try {
        for (var fnKeys_1 = __values(fnKeys), fnKeys_1_1 = fnKeys_1.next(); !fnKeys_1_1.done; fnKeys_1_1 = fnKeys_1.next()) {
            var fnKey = fnKeys_1_1.value;
            _loop_1(fnKey);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fnKeys_1_1 && !fnKeys_1_1.done && (_a = fnKeys_1.return)) _a.call(fnKeys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return toExports;
}
exports.exportsHandlers = exportsHandlers;
var inputToOutput = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var appkey, sourceAppKey, userNick, mixNick, miniappId, sourceMiniAppId, accessToken, openId, appOwnerOpenId, env, traceId, handler, data;
    return __generator(this, function (_a) {
        appkey = context.appkey, sourceAppKey = context.sourceAppKey, userNick = context.userNick, mixNick = context.mixNick, miniappId = context.miniappId, sourceMiniAppId = context.sourceMiniAppId, accessToken = context.accessToken, openId = context.openId, appOwnerOpenId = context.appOwnerOpenId, env = context.env, traceId = context.traceId, handler = context.handler, data = context.data;
        return [2 /*return*/, {
                appkey: appkey,
                sourceAppKey: sourceAppKey,
                userNick: userNick,
                mixNick: mixNick,
                miniappId: miniappId,
                sourceMiniAppId: sourceMiniAppId,
                accessToken: accessToken,
                openId: openId,
                appOwnerOpenId: appOwnerOpenId,
                env: env,
                traceId: traceId,
                handler: handler,
                data: data,
            }];
    });
}); };
exports.inputToOutput = inputToOutput;
exports.mainExports = {
    /**
     * 游客身份信息测试
     */
    guestTest: exports.inputToOutput,
    /**
     * main 连通测试
     */
    main: exports.inputToOutput,
};
/*

https://miniapp.open.taobao.com/doc.htm?docId=118990&docType=1&tag=dev

appkey	string
  运行时使用的appkey，

  1,如果是BC模式，那么这里是B端appkey;

  2,如果是模板开发模式，这里是模板的appkey;

  3,如果是插件开发模式，这里是宿主小程序的appkey;


sourceAppKey

  string
  当前调用小程序的appkey

  1,如果是BC模式，那么这里是C端appkey;

  2,如果是模板开发模式，这里是实例的appkey;

  3,如果是插件开发模式，这里是插件的appkey;




userNick

  string
  当前用户的昵称。

  若在小程序中未调用授权API，则无此字段




mixNick	string
  当前用户的mixNick




miniappId

  string
  运行时使用的小程序ID，

  1,如果是BC模式，那么这里是B端小程序ID;

  2,如果是模板开发模式，这里是模板的小程序ID;

  3,如果是插件开发模式，这里是宿主小程序的小程序ID;




sourceMiniAppId	string
  当前调用小程序的小程序ID

  1,如果是BC模式，那么这里是C端小程序ID;

  2,如果是模板开发模式，这里是实例的小程序ID;

  3,如果是插件开发模式，这里是插件的小程序ID;




accessToken

  string
  当前用户授权产生的sessionKey, 主要用于调用TOP-API。

  若在小程序中未调用授权API，则无此字段




openId

  string
  当前使用用户的openId




env	string
  当前云函数环境




traceId	string
  云函数调用唯一ID




fcName	string
  当前被调用的云函数名称




handler

  string
  当前被调用的云函数中的Handler




appOwnerOpenId

  string
  当前小程序的拥有者的openId，用于BC打通。

  对于BC打通场景，在B端，openId是当前登录用户ID，由于是商家使用B端，这里openId即为商家ID；

  在C端，小程序拥有者为商家，appOwnerOpenId即为商家Id ;




data

  JSON

  函数的业务参数


 *
 */ 
