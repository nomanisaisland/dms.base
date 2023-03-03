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
exports.miniappTbWidgetTemplateUpdateapp = exports.miniappTbWidgetTemplateInstantiate = exports.miniappTbTemplateOnlineapp = exports.miniappTbTemplateUpdateapp = exports.miniappTbTemplateInstantiate = void 0;
var miniappTbTemplateInstantiate = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var cloud, _a, clients, description, ext_json, icon, name, template_id, template_version, alias, tbMiniapp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cloud = context.cloud;
                _a = context.data, clients = _a.clients, description = _a.description, ext_json = _a.ext_json, icon = _a.icon, name = _a.name, template_id = _a.template_id, template_version = _a.template_version, alias = _a.alias;
                return [4 /*yield*/, cloud.topApi.invoke({
                        api: 'taobao.miniapp.template.instantiate',
                        data: {
                            clients: clients,
                            description: description,
                            ext_json: ext_json,
                            icon: icon,
                            name: name,
                            template_id: template_id,
                            template_version: template_version,
                            alias: alias || name,
                        },
                        autoSession: true
                    })];
            case 1:
                tbMiniapp = _b.sent();
                return [2 /*return*/, tbMiniapp];
        }
    });
}); };
exports.miniappTbTemplateInstantiate = miniappTbTemplateInstantiate;
var miniappTbTemplateUpdateapp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var cloud, _a, clients, app_id, ext_json, template_id, template_version, alias, desc, tbMiniapp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cloud = context.cloud;
                _a = context.data, clients = _a.clients, app_id = _a.app_id, ext_json = _a.ext_json, template_id = _a.template_id, template_version = _a.template_version, alias = _a.alias, desc = _a.desc;
                return [4 /*yield*/, cloud.topApi.invoke({
                        api: 'taobao.miniapp.template.updateapp',
                        data: __assign(__assign({ clients: clients, app_id: app_id, ext_json: ext_json, template_id: template_id, template_version: template_version }, !!alias ? {
                            alias: alias,
                        } : {}), !!desc ? {
                            desc: desc,
                        } : {}),
                        autoSession: true
                    })];
            case 1:
                tbMiniapp = _b.sent();
                return [2 /*return*/, tbMiniapp];
        }
    });
}); };
exports.miniappTbTemplateUpdateapp = miniappTbTemplateUpdateapp;
var miniappTbTemplateOnlineapp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var cloud, _a, clients, app_id, template_id, template_version, app_version, tbMiniapp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cloud = context.cloud;
                _a = context.data, clients = _a.clients, app_id = _a.app_id, template_id = _a.template_id, template_version = _a.template_version, app_version = _a.app_version;
                return [4 /*yield*/, cloud.topApi.invoke({
                        api: 'taobao.miniapp.template.onlineapp',
                        data: {
                            clients: clients,
                            app_id: app_id,
                            template_id: template_id,
                            template_version: template_version,
                            app_version: app_version,
                        },
                        autoSession: true
                    })];
            case 1:
                tbMiniapp = _b.sent();
                return [2 /*return*/, tbMiniapp];
        }
    });
}); };
exports.miniappTbTemplateOnlineapp = miniappTbTemplateOnlineapp;
//小部件实例化
//流程代码参考 https://miniapp.open.taobao.com/doc.htm?docId=119272&docType=1&tag=dev
var miniappTbWidgetTemplateInstantiate = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var cloud, _a, description, template_id, template_version, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cloud = context.cloud;
                _a = context.data, description = _a.description, template_id = _a.template_id, template_version = _a.template_version;
                return [4 /*yield*/, cloud.topApi.invoke({
                        api: 'taobao.miniapp.widget.template.instantiate',
                        data: {
                            param_mini_app_instantiate_template_app_simple_request: {
                                template_id: template_id,
                                template_version: template_version,
                                description: description,
                            },
                        },
                        autoSession: true
                    })];
            case 1:
                res = _b.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.miniappTbWidgetTemplateInstantiate = miniappTbWidgetTemplateInstantiate;
var miniappTbWidgetTemplateUpdateapp = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var cloud, _a, entity_id, template_id, template_version, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cloud = context.cloud;
                _a = context.data, entity_id = _a.entity_id, template_id = _a.template_id, template_version = _a.template_version;
                return [4 /*yield*/, cloud.topApi.invoke({
                        api: 'taobao.miniapp.widget.template.instance.update',
                        data: {
                            param_mini_app_instantiate_template_app_update_request: {
                                entity_id: entity_id,
                                template_id: template_id,
                                template_version: template_version,
                            },
                        },
                        autoSession: true
                    })];
            case 1:
                res = _b.sent();
                return [2 /*return*/, res];
        }
    });
}); };
exports.miniappTbWidgetTemplateUpdateapp = miniappTbWidgetTemplateUpdateapp;
