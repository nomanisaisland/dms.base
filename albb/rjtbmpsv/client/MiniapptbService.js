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
exports.pubTb = void 0;
var SimpleIoc_1 = require("../../../pack/SimpleIoc");
var TbmpcloudClient_1 = require("./TbmpcloudClient");
var UsessionService_1 = require("./UsessionService");
var cloudDbClient_1 = require("./cloudDbClient");
/**
 * 发布到淘宝
 */
function pubTb(model, template) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var tbMiniapp, tbMiniapp, tbOnline, usessionService, usession, res, tbMiniapp, res, tbMiniapp, usessionService, usession;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!!template) return [3 /*break*/, 2];
                    return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", {}, "miniappTemplateList")];
                case 1:
                    template = (_e.sent()).filter(function (a) { return a.runatType == model.runatType; })[0];
                    _e.label = 2;
                case 2:
                    model.templateId = template.id;
                    model.tbTemplateId = template.tbTemplateId;
                    model.tbTemplateVersion = template.tbTemplateVersion;
                    if (!(model.runatType == 'miniapp')) return [3 /*break*/, 10];
                    if (!!model.tbAppId) return [3 /*break*/, 4];
                    return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", {
                            clients: model.tbClients,
                            description: model.description,
                            ext_json: model.tbExtJson,
                            icon: model.icon,
                            name: model.name,
                            alias: model.alias,
                            template_id: model.tbTemplateId,
                            template_version: model.tbTemplateVersion,
                        }, "miniappTbTemplateInstantiate")];
                case 3:
                    tbMiniapp = _e.sent();
                    if (!!tbMiniapp.error) {
                        throw {
                            error: tbMiniapp.error,
                            message: tbMiniapp.error.sub_msg,
                        };
                    }
                    model.tbPreViewUrl = tbMiniapp.pre_view_url;
                    model.tbAppId = tbMiniapp.app_id;
                    model.tbAppkey = tbMiniapp.appkey;
                    model.tbAppVersion = tbMiniapp.app_version;
                    model.tbAppName = tbMiniapp.app_name;
                    model.tbAppAlias = tbMiniapp.app_alias;
                    model.tbAppDescription = tbMiniapp.app_description;
                    model.tbAppIcon = tbMiniapp.app_icon;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", __assign(__assign({ clients: model.tbClients, ext_json: model.tbExtJson, template_id: model.tbTemplateId, template_version: model.tbTemplateVersion, app_id: model.tbAppId }, model.name == model.tbAppAlias ? undefined : { alias: model.name }), model.description == model.tbAppDescription ? undefined : { desc: model.description }), "miniappTbTemplateUpdateapp")];
                case 5:
                    tbMiniapp = _e.sent();
                    if (!!tbMiniapp.error) {
                        throw {
                            error: tbMiniapp.error,
                            message: tbMiniapp.error.sub_msg,
                        };
                    }
                    model.tbPreViewUrl = tbMiniapp.pre_view_url;
                    model.tbAppId = tbMiniapp.app_id;
                    model.tbAppkey = tbMiniapp.appkey;
                    model.tbAppVersion = tbMiniapp.app_version;
                    model.tbAppName = tbMiniapp.app_name;
                    model.tbAppAlias = tbMiniapp.app_alias;
                    model.tbAppDescription = tbMiniapp.app_description;
                    model.tbAppIcon = tbMiniapp.app_icon;
                    _e.label = 6;
                case 6: return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", {
                        clients: model.tbClients,
                        app_id: model.tbAppId,
                        template_id: model.tbTemplateId,
                        template_version: model.tbTemplateVersion,
                        app_version: model.tbAppVersion,
                    }, "miniappTbTemplateOnlineapp")];
                case 7:
                    tbOnline = _e.sent();
                    if (!!tbOnline.error) {
                        throw {
                            error: tbOnline.error,
                            message: tbOnline.error.sub_msg,
                        };
                    }
                    model.tbOnlineUrl = tbOnline.app_info.online_url;
                    usessionService = SimpleIoc_1.SimpleIoc.resolve(UsessionService_1.UsessionService);
                    return [4 /*yield*/, usessionService.detailTb()];
                case 8:
                    usession = _e.sent();
                    model.editTime = model.editTime || Date.now();
                    model.editUserId = usession.user.id;
                    model.pubTbTime = Date.now();
                    return [4 /*yield*/, cloudDbClient_1.cloudDbClient.collection("miniapp").updateMany({
                            shopId: usession.shop.id,
                            id: model.id,
                        }, {
                            $set: {
                                tbTemplateId: model.tbTemplateId,
                                tbTemplateVersion: model.tbTemplateVersion,
                                tbAppId: model.tbAppId,
                                tbClients: model.tbClients,
                                tbExtJson: model.tbExtJson,
                                tbAppkey: model.tbAppkey,
                                tbAppVersion: model.tbAppVersion,
                                tbAppDescription: model.tbAppDescription,
                                tbAppName: model.tbAppName,
                                tbAppAlias: model.tbAppAlias,
                                tbAppIcon: model.tbAppIcon,
                                tbPreViewUrl: model.tbPreViewUrl,
                                tbOnlineUrl: model.tbOnlineUrl,
                                editTime: model.editTime,
                                editUserId: model.editUserId,
                                pubTbTime: model.pubTbTime,
                            },
                        })];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    if (!(model.runatType == 'widget')) return [3 /*break*/, 17];
                    if (!!model.tbAppId) return [3 /*break*/, 12];
                    return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", {
                            description: model.description,
                            template_id: model.tbTemplateId,
                            template_version: model.tbTemplateVersion,
                        }, "miniappTbWidgetTemplateInstantiate")];
                case 11:
                    res = _e.sent();
                    if (((_a = res === null || res === void 0 ? void 0 : res.result) === null || _a === void 0 ? void 0 : _a.success) != "true") {
                        throw {
                            errorMessage: ((_b = res === null || res === void 0 ? void 0 : res.result) === null || _b === void 0 ? void 0 : _b.err_message) ||
                                (res === null || res === void 0 ? void 0 : res.sub_msg) ||
                                'error',
                        };
                    }
                    tbMiniapp = res.result.model;
                    model.tbPreViewUrl = tbMiniapp.pre_view_url;
                    model.tbAppId = tbMiniapp.app_id || tbMiniapp.id;
                    model.tbAppkey = tbMiniapp.appkey;
                    model.tbAppVersion = tbMiniapp.app_version ||
                        tbMiniapp.new_version ||
                        tbMiniapp.online_version;
                    model.tbAppName = tbMiniapp.app_name;
                    model.tbAppAlias = tbMiniapp.app_alias;
                    model.tbAppDescription = tbMiniapp.app_description;
                    model.tbAppIcon = tbMiniapp.app_icon;
                    model.tbOnlineCode = tbMiniapp.online_code;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke("cloudfuncs", {
                        entity_id: model.tbAppId,
                        template_id: model.tbTemplateId,
                        template_version: model.tbTemplateVersion,
                    }, "miniappTbWidgetTemplateUpdateapp")];
                case 13:
                    res = _e.sent();
                    if (((_c = res === null || res === void 0 ? void 0 : res.result) === null || _c === void 0 ? void 0 : _c.success) != "true") {
                        throw {
                            errorMessage: ((_d = res === null || res === void 0 ? void 0 : res.result) === null || _d === void 0 ? void 0 : _d.err_message) ||
                                (res === null || res === void 0 ? void 0 : res.sub_msg) ||
                                'error',
                        };
                    }
                    tbMiniapp = res.result.model;
                    model.tbPreViewUrl = tbMiniapp.pre_view_url;
                    model.tbAppId = tbMiniapp.app_id || tbMiniapp.id;
                    model.tbAppkey = tbMiniapp.appkey;
                    model.tbAppVersion = tbMiniapp.app_version ||
                        tbMiniapp.online_version;
                    model.tbAppName = tbMiniapp.app_name;
                    model.tbAppAlias = tbMiniapp.app_alias;
                    model.tbAppDescription = tbMiniapp.app_description;
                    model.tbAppIcon = tbMiniapp.app_icon;
                    _e.label = 14;
                case 14:
                    usessionService = SimpleIoc_1.SimpleIoc.resolve(UsessionService_1.UsessionService);
                    return [4 /*yield*/, usessionService.detailTb()];
                case 15:
                    usession = _e.sent();
                    model.editTime = model.editTime;
                    model.editUserId = usession.user.id;
                    model.pubTbTime = Date.now();
                    return [4 /*yield*/, cloudDbClient_1.cloudDbClient.collection("miniapp").updateMany({
                            shopId: usession.shop.id,
                            id: model.id,
                        }, {
                            $set: {
                                tbTemplateId: model.tbTemplateId,
                                tbTemplateVersion: model.tbTemplateVersion,
                                tbAppId: model.tbAppId,
                                tbClients: model.tbClients,
                                tbExtJson: model.tbExtJson,
                                tbAppkey: model.tbAppkey,
                                tbAppVersion: model.tbAppVersion,
                                tbAppDescription: model.tbAppDescription,
                                tbAppName: model.tbAppName,
                                tbAppAlias: model.tbAppAlias,
                                tbAppIcon: model.tbAppIcon,
                                tbPreViewUrl: model.tbPreViewUrl,
                                tbOnlineUrl: model.tbOnlineUrl,
                                tbOnlineCode: model.tbOnlineCode,
                                editTime: model.editTime,
                                editUserId: model.editUserId,
                                pubTbTime: model.pubTbTime,
                            },
                        })];
                case 16:
                    _e.sent();
                    _e.label = 17;
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.pubTb = pubTb;
