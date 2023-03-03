"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.usessionDetailTb = void 0;
var RandomUtil_1 = require("../../../value/RandomUtil");
var RouteEnvConfig_1 = require("../../../pack/RouteEnvConfig");
/**
 * 获取会话信息，包含 店铺，用户，小程序，访客。
 * 支持这些客户端请求 C端小程序实例，B端小程序，C端小部件实例。
 */
function usessionDetailTb(context) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    return __awaiter(this, void 0, void 0, function () {
        var cloud, appOwnerOpenId, openId, miniappId, sourceMiniAppId, mixNick, userNick, accessToken, template, runatType, callData, tbNickName, tbAvatar, shopTbNickName, tbShopGet_1, tbSellerGet_1, miniapp, shop, _q, tbSeller, tbShop, tbSeller, tbSeller, tbShop, tbSeller, newid, tbShop, tbSeller, user, newid, newid, visitor, newid, output, error_1;
        var _this = this;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    cloud = context.cloud;
                    appOwnerOpenId = context.appOwnerOpenId, openId = context.openId, miniappId = context.miniappId, sourceMiniAppId = context.sourceMiniAppId, mixNick = context.mixNick, userNick = context.userNick, accessToken = context.accessToken;
                    _r.label = 1;
                case 1:
                    _r.trys.push([1, 49, , 50]);
                    template = (_a = RouteEnvConfig_1.RouteEnvConfig.miniappTemplateList) === null || _a === void 0 ? void 0 : _a.find(function (a) { return a.tbTemplateId == miniappId; });
                    runatType = (template === null || template === void 0 ? void 0 : template.runatType) || 'other';
                    callData = context.data;
                    tbNickName = callData.tbNickName || userNick;
                    tbAvatar = callData.tbAvatar;
                    shopTbNickName = undefined;
                    if (runatType == 'qn') {
                        shopTbNickName = tbNickName === null || tbNickName === void 0 ? void 0 : tbNickName.split(":")[0];
                    }
                    tbShopGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, undefined];
                    }); }); };
                    if (runatType == 'qn' && !!RouteEnvConfig_1.RouteEnvConfig.bizTbShopFetch) {
                        tbShopGet_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                            var tbModel_1, error_2, errorMessage, errorModel_1;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, cloud.topApi.invoke({
                                                api: 'taobao.shop.seller.get',
                                                data: {
                                                    fields: 'sid,title,pic_path'
                                                },
                                                autoSession: true,
                                            })];
                                    case 1:
                                        tbModel_1 = _a.sent();
                                        tbShopGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, tbModel_1];
                                        }); }); };
                                        return [2 /*return*/, tbModel_1];
                                    case 2:
                                        error_2 = _a.sent();
                                        errorMessage = String((error_2 === null || error_2 === void 0 ? void 0 : error_2.errorMessage) || (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || error_2 || "error");
                                        errorModel_1 = {
                                            errorMessage: errorMessage,
                                        };
                                        tbShopGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, errorModel_1];
                                        }); }); };
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (RouteEnvConfig_1.RouteEnvConfig.bizTbShopFetch != true) {
                            tbShopGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, String(RouteEnvConfig_1.RouteEnvConfig.bizTbShopFetch)];
                            }); }); };
                        }
                    }
                    tbSellerGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, undefined];
                    }); }); };
                    if (runatType == 'qn' && !!RouteEnvConfig_1.RouteEnvConfig.bizTbSellerFetch) {
                        tbSellerGet_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                            var tbModel_2, error_3, errorMessage, errorModel_2;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, cloud.topApi.invoke({
                                                api: 'taobao.user.seller.get',
                                                data: {
                                                    // fields: 'user_id,nick,sex,seller_credit,type,has_more_pic,item_img_num,item_img_size,prop_img_num,prop_img_size,auto_repost,promoted_type,status,alipay_bind,consumer_protection,avatar,liangpin,sign_food_seller_promise,has_shop,is_lightning_consignment,has_sub_stock,is_golden_seller,magazine_subscribe,vertical_market,online_gaming,is_tjb_seller,vip_info'
                                                    fields: 'user_id,nick,sex',
                                                },
                                                autoSession: true,
                                            })];
                                    case 1:
                                        tbModel_2 = _a.sent();
                                        tbSellerGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, tbModel_2];
                                        }); }); };
                                        return [2 /*return*/, tbModel_2];
                                    case 2:
                                        error_3 = _a.sent();
                                        errorMessage = String((error_3 === null || error_3 === void 0 ? void 0 : error_3.errorMessage) || (error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || error_3 || "error");
                                        errorModel_2 = {
                                            errorMessage: errorMessage,
                                        };
                                        tbSellerGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, errorModel_2];
                                        }); }); };
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (RouteEnvConfig_1.RouteEnvConfig.bizTbSellerFetch != true) {
                            tbShopGet_1 = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, String(RouteEnvConfig_1.RouteEnvConfig.bizTbSellerFetch)];
                            }); }); };
                        }
                    }
                    return [4 /*yield*/, cloud.db.collection('miniapp').find({
                            tbAppId: sourceMiniAppId,
                        })];
                case 2:
                    miniapp = (_r.sent())[0];
                    if (!!!(miniapp === null || miniapp === void 0 ? void 0 : miniapp.shopId)) return [3 /*break*/, 4];
                    return [4 /*yield*/, cloud.db.collection('shop').find({
                            id: (miniapp === null || miniapp === void 0 ? void 0 : miniapp.shopId) || "bad",
                        })];
                case 3:
                    _q = (_r.sent())[0];
                    return [3 /*break*/, 5];
                case 4:
                    _q = undefined;
                    _r.label = 5;
                case 5:
                    shop = _q;
                    if (!!shop) return [3 /*break*/, 20];
                    if (!(!shopTbNickName && runatType == 'qn')) return [3 /*break*/, 7];
                    return [4 /*yield*/, tbSellerGet_1()];
                case 6:
                    tbSeller = _r.sent();
                    if (!!((_b = tbSeller === null || tbSeller === void 0 ? void 0 : tbSeller.user) === null || _b === void 0 ? void 0 : _b.nick)) {
                        shopTbNickName = String(tbSeller.user.nick).split(':')[0];
                    }
                    _r.label = 7;
                case 7:
                    if (!(!shop && !!shopTbNickName)) return [3 /*break*/, 9];
                    return [4 /*yield*/, cloud.db.collection('shop').find({
                            tbNickName: shopTbNickName,
                        })];
                case 8:
                    shop = (_r.sent())[0];
                    _r.label = 9;
                case 9:
                    if (!!shop) return [3 /*break*/, 12];
                    return [4 /*yield*/, tbShopGet_1()];
                case 10:
                    tbShop = _r.sent();
                    if (!!!((_c = tbShop === null || tbShop === void 0 ? void 0 : tbShop.shop) === null || _c === void 0 ? void 0 : _c.sid)) return [3 /*break*/, 12];
                    return [4 /*yield*/, cloud.db.collection('shop').find({
                            tbShopId: String(tbShop.shop.sid),
                        })];
                case 11:
                    shop = (_r.sent())[0];
                    _r.label = 12;
                case 12:
                    if (!!shop) return [3 /*break*/, 15];
                    return [4 /*yield*/, tbSellerGet_1()];
                case 13:
                    tbSeller = _r.sent();
                    if (!!!((_d = tbSeller === null || tbSeller === void 0 ? void 0 : tbSeller.user) === null || _d === void 0 ? void 0 : _d.user_id)) return [3 /*break*/, 15];
                    return [4 /*yield*/, cloud.db.collection('shop').find({
                            tbSellerId: String(tbSeller.user.user_id),
                        })];
                case 14:
                    shop = (_r.sent())[0];
                    _r.label = 15;
                case 15:
                    if (!!shop) return [3 /*break*/, 18];
                    return [4 /*yield*/, tbSellerGet_1()];
                case 16:
                    tbSeller = _r.sent();
                    if (!!!((_e = tbSeller === null || tbSeller === void 0 ? void 0 : tbSeller.user) === null || _e === void 0 ? void 0 : _e.nick)) return [3 /*break*/, 18];
                    return [4 /*yield*/, cloud.db.collection('shop').find({
                            tbSellerNick: String(tbSeller.user.nick),
                        })];
                case 17:
                    shop = (_r.sent())[0];
                    _r.label = 18;
                case 18:
                    if (!(!shop && !!appOwnerOpenId)) return [3 /*break*/, 20];
                    return [4 /*yield*/, cloud.db.collection('shop').find({
                            tbAppOwnerOpenId: appOwnerOpenId,
                        })];
                case 19:
                    shop = (_r.sent())[0];
                    _r.label = 20;
                case 20:
                    if (!!shop) return [3 /*break*/, 24];
                    return [4 /*yield*/, tbShopGet_1()];
                case 21:
                    tbShop = _r.sent();
                    return [4 /*yield*/, tbSellerGet_1()];
                case 22:
                    tbSeller = _r.sent();
                    newid = RandomUtil_1.RandomUtil.guidStringN();
                    shop = {
                        _id: newid,
                        id: newid,
                        //主帐号
                        tbNickName: shopTbNickName,
                        tbMixNick: shopTbNickName == tbNickName ? mixNick : undefined,
                        //从店铺
                        tbShopId: (_g = (_f = tbShop === null || tbShop === void 0 ? void 0 : tbShop.shop) === null || _f === void 0 ? void 0 : _f.sid) === null || _g === void 0 ? void 0 : _g.toString(),
                        tbTitle: (_h = tbShop === null || tbShop === void 0 ? void 0 : tbShop.shop) === null || _h === void 0 ? void 0 : _h.title,
                        tbPic: (_j = tbShop === null || tbShop === void 0 ? void 0 : tbShop.shop) === null || _j === void 0 ? void 0 : _j.pic_path,
                        tbShopErrorMessage: tbShop === null || tbShop === void 0 ? void 0 : tbShop.errorMessage,
                        //从卖家
                        tbSellerId: (_l = (_k = tbSeller === null || tbSeller === void 0 ? void 0 : tbSeller.user) === null || _k === void 0 ? void 0 : _k.user_id) === null || _l === void 0 ? void 0 : _l.toString(),
                        tbSellerNick: (_m = tbSeller === null || tbSeller === void 0 ? void 0 : tbSeller.user) === null || _m === void 0 ? void 0 : _m.nick,
                        //所有者OpenId
                        tbAppOwnerOpenId: appOwnerOpenId,
                        //记录
                        addTbNickName: tbNickName,
                        addTbMixNick: mixNick,
                        addTime: Date.now(),
                        addUserTbOpenId: openId,
                    };
                    if (!shop.tbNickName &&
                        !shop.tbShopId &&
                        !shop.tbSellerId &&
                        !shop.tbSellerNick &&
                        !shop.tbAppOwnerOpenId) {
                        throw new Error('初始化店铺至少需要提供一个【重要标识】。');
                    }
                    return [4 /*yield*/, cloud.db.collection("shop").insertOne(shop)];
                case 23:
                    _r.sent();
                    _r.label = 24;
                case 24:
                    if (!!!shop.id) return [3 /*break*/, 34];
                    if (!(!shop.tbNickName && !!shopTbNickName)) return [3 /*break*/, 26];
                    shop.tbNickName = shopTbNickName;
                    return [4 /*yield*/, cloud.db.collection("shop").updateMany({
                            id: shop.id,
                        }, {
                            $set: {
                                tbNickName: shop.tbNickName,
                            },
                        })];
                case 25:
                    _r.sent();
                    _r.label = 26;
                case 26:
                    if (!!shop.tbShopId) return [3 /*break*/, 29];
                    return [4 /*yield*/, tbShopGet_1()];
                case 27:
                    tbShop = _r.sent();
                    if (!!!((_o = tbShop === null || tbShop === void 0 ? void 0 : tbShop.shop) === null || _o === void 0 ? void 0 : _o.sid)) return [3 /*break*/, 29];
                    shop.tbShopId = String(tbShop.shop.sid);
                    shop.tbTitle = tbShop.shop.title;
                    shop.tbPic = tbShop.shop.pic_path;
                    shop.tbShopErrorMessage = '';
                    return [4 /*yield*/, cloud.db.collection("shop").updateMany({
                            id: shop.id,
                        }, {
                            $set: {
                                tbShopId: shop.tbShopId,
                                tbTitle: shop.tbTitle,
                                tbPic: shop.tbPic,
                                tbShopErrorMessage: shop.tbShopErrorMessage,
                            },
                        })];
                case 28:
                    _r.sent();
                    _r.label = 29;
                case 29:
                    if (!!shop.tbSellerId) return [3 /*break*/, 32];
                    return [4 /*yield*/, tbSellerGet_1()];
                case 30:
                    tbSeller = _r.sent();
                    if (!!!((_p = tbSeller === null || tbSeller === void 0 ? void 0 : tbSeller.user) === null || _p === void 0 ? void 0 : _p.user_id)) return [3 /*break*/, 32];
                    shop.tbSellerId = String(tbSeller.user.user_id);
                    shop.tbSellerNick = String(tbSeller.user.nick);
                    return [4 /*yield*/, cloud.db.collection("shop").updateMany({
                            id: shop.id,
                        }, {
                            $set: {
                                tbSellerId: shop.tbSellerId,
                                tbSellerNick: shop.tbSellerNick,
                            },
                        })];
                case 31:
                    _r.sent();
                    _r.label = 32;
                case 32:
                    if (!(!shop.tbAppOwnerOpenId && !!appOwnerOpenId)) return [3 /*break*/, 34];
                    shop.tbAppOwnerOpenId = appOwnerOpenId;
                    return [4 /*yield*/, cloud.db.collection("shop").updateMany({
                            id: shop.id,
                        }, {
                            $set: {
                                tbAppOwnerOpenId: shop.tbAppOwnerOpenId,
                            },
                        })];
                case 33:
                    _r.sent();
                    _r.label = 34;
                case 34: return [4 /*yield*/, cloud.db.collection('user').find({
                        shopId: shop.id,
                        tbOpenId: openId,
                    })];
                case 35:
                    user = (_r.sent())[0];
                    if (!!user) return [3 /*break*/, 37];
                    newid = openId + "__" + shop.id;
                    //const newid = RandomUtil.guidStringN();
                    user = {
                        _id: newid,
                        id: newid,
                        shopId: shop.id,
                        tbOpenId: openId,
                        tbNickName: tbNickName,
                        tbMixNick: mixNick,
                        addTime: Date.now(),
                    };
                    return [4 /*yield*/, cloud.db.collection("user").insertOne(user)];
                case 36:
                    _r.sent();
                    _r.label = 37;
                case 37:
                    if (!(!!tbNickName && tbNickName !== user.tbNickName ||
                        !!tbAvatar && tbAvatar !== user.tbAvatar ||
                        runatType == 'miniapp' && !!accessToken && accessToken !== user.tbAccessToken ||
                        runatType == 'qn' && !!accessToken && accessToken !== user.tbBizAccessToken)) return [3 /*break*/, 39];
                    if (!!tbNickName) {
                        user.tbNickName = tbNickName;
                        user.tbNickNameTime = Date.now();
                    }
                    if (!!tbAvatar) {
                        user.tbAvatar = tbAvatar;
                        user.tbAvatarTime = Date.now();
                    }
                    if (runatType == 'miniapp' && !!accessToken) {
                        user.tbAccessToken = accessToken;
                        user.tbAccessTokenTime = Date.now();
                    }
                    if (runatType == 'qn' && !!accessToken) {
                        user.tbBizAccessToken = accessToken;
                        user.tbBizAccessTokenTime = Date.now();
                    }
                    return [4 /*yield*/, cloud.db.collection("user").updateMany({
                            id: user.id,
                        }, {
                            $set: {
                                tbNickName: user.tbNickName,
                                tbNickNameTime: user.tbNickNameTime,
                                tbAvatar: user.tbAvatar,
                                tbAvatarTime: user.tbAvatarTime,
                                tbAccessToken: user.tbAccessToken,
                                tbAccessTokenTime: user.tbAccessTokenTime,
                                tbBizAccessToken: user.tbBizAccessToken,
                                tbBizAccessTokenTime: user.tbBizAccessTokenTime,
                            },
                        })];
                case 38:
                    _r.sent();
                    _r.label = 39;
                case 39:
                    if (!!miniapp) return [3 /*break*/, 41];
                    newid = sourceMiniAppId;
                    //const newid = RandomUtil.guidStringN();
                    miniapp = {
                        _id: newid,
                        id: newid,
                        shopId: shop.id,
                        tbAppId: sourceMiniAppId,
                        runatType: runatType,
                        templateId: miniappId,
                        tbTemplateId: miniappId,
                        addTime: Date.now(),
                    };
                    return [4 /*yield*/, cloud.db.collection("miniapp").insertOne(miniapp)];
                case 40:
                    _r.sent();
                    _r.label = 41;
                case 41:
                    if (!!!miniapp.id) return [3 /*break*/, 43];
                    if (!(!miniapp.runatType || miniapp.runatType != runatType)) return [3 /*break*/, 43];
                    miniapp.runatType = runatType;
                    return [4 /*yield*/, cloud.db.collection("miniapp").updateMany({
                            id: miniapp.id,
                        }, {
                            $set: {
                                runatType: miniapp.runatType,
                            },
                        })];
                case 42:
                    _r.sent();
                    _r.label = 43;
                case 43: return [4 /*yield*/, cloud.db.collection("visitor").find({
                        shopId: shop.id,
                        userId: user.id,
                        miniappId: miniapp.id,
                    })];
                case 44:
                    visitor = (_r.sent())[0];
                    if (!!visitor) return [3 /*break*/, 46];
                    newid = openId + "__" + sourceMiniAppId;
                    //const newid = RandomUtil.guidStringN();
                    visitor = {
                        _id: newid,
                        id: newid,
                        shopId: shop.id,
                        userId: user.id,
                        miniappId: miniapp.id,
                        tbOpenId: openId,
                        tbNickName: tbNickName,
                        tbMixNick: mixNick,
                        addTime: Date.now(),
                    };
                    return [4 /*yield*/, cloud.db.collection("visitor").insertOne(visitor)];
                case 45:
                    _r.sent();
                    _r.label = 46;
                case 46:
                    if (!(!!tbNickName && tbNickName !== visitor.tbNickName ||
                        !!tbAvatar && tbAvatar !== visitor.tbAvatar ||
                        runatType == 'miniapp' && !!accessToken && accessToken !== visitor.tbAccessToken ||
                        runatType == 'qn' && !!accessToken && accessToken !== visitor.tbBizAccessToken)) return [3 /*break*/, 48];
                    if (!!tbNickName) {
                        visitor.tbNickName = tbNickName;
                        visitor.tbNickNameTime = Date.now();
                    }
                    if (!!tbAvatar) {
                        visitor.tbAvatar = tbAvatar;
                        visitor.tbAvatarTime = Date.now();
                    }
                    if (runatType == 'miniapp' && !!accessToken) {
                        visitor.tbAccessToken = accessToken;
                        visitor.tbAccessTokenTime = Date.now();
                    }
                    if (runatType == 'qn' && !!accessToken) {
                        visitor.tbBizAccessToken = accessToken;
                        visitor.tbBizAccessTokenTime = Date.now();
                    }
                    return [4 /*yield*/, cloud.db.collection("visitor").updateMany({
                            id: visitor.id,
                        }, {
                            $set: {
                                tbNickName: visitor.tbNickName,
                                tbNickNameTime: visitor.tbNickNameTime,
                                tbAvatar: visitor.tbAvatar,
                                tbAvatarTime: visitor.tbAvatarTime,
                                tbAccessToken: visitor.tbAccessToken,
                                tbAccessTokenTime: visitor.tbAccessTokenTime,
                                tbBizAccessToken: visitor.tbBizAccessToken,
                                tbBizAccessTokenTime: visitor.tbBizAccessTokenTime,
                            },
                        })];
                case 47:
                    _r.sent();
                    _r.label = 48;
                case 48:
                    output = __assign({ shop: shop, user: user, miniapp: miniapp, visitor: visitor }, {
                        input: {
                            appOwnerOpenId: appOwnerOpenId,
                            openId: openId,
                            miniappId: miniappId,
                            sourceMiniAppId: sourceMiniAppId,
                            mixNick: mixNick,
                            userNick: userNick,
                            accessToken: accessToken,
                            env: context.env,
                            data: callData,
                        },
                    });
                    return [2 /*return*/, output];
                case 49:
                    error_1 = _r.sent();
                    return [2 /*return*/, {
                            error: __assign({ errorToString: String(error_1 || "error"), errorMessage: String((error_1 === null || error_1 === void 0 ? void 0 : error_1.errorMessage) || (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1 || "error") }, error_1),
                            input: {
                                appOwnerOpenId: appOwnerOpenId,
                                openId: openId,
                                miniappId: miniappId,
                                sourceMiniAppId: sourceMiniAppId,
                                mixNick: mixNick,
                                userNick: userNick,
                                accessToken: accessToken,
                                env: context.env,
                                data: context.data,
                            },
                        }];
                case 50: return [2 /*return*/];
            }
        });
    });
}
exports.usessionDetailTb = usessionDetailTb;
;
