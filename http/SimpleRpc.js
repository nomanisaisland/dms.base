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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleRpc = void 0;
var Exception_1 = require("../value/Exception");
function kvs(data, name) {
    if (name === void 0) { name = ""; }
    if ((data !== null && data !== void 0 ? data : undefined) === undefined) {
        return [{ name: name, value: "", }];
    }
    if (typeof data === "boolean") {
        return [{ name: name, value: !!data ? "1" : "", }];
    }
    if (typeof data === "string" ||
        typeof data === "number" ||
        typeof data === "bigint") {
        return [
            { name: name, value: data + "", }
        ];
    }
    if (typeof Blob !== "undefined" &&
        data instanceof Blob) {
        return [{ name: name, file: data, }];
    }
    if (typeof HTMLInputElement !== "undefined" &&
        data instanceof HTMLInputElement &&
        data.type === "file") {
        return Array.from(data.files || []).map(function (file) { return ({ name: name, file: file, }); });
    }
    if (typeof data === "object" && (!!data.fileHold ||
        !!data.originFileObj)) {
        if (!data.originFileObj) {
            return [];
        }
        return [{ name: name, file: data.originFileObj, }];
    }
    return Object.keys(data).flatMap(function (k) { return __spreadArray([], __read(kvs(data[k], Number.isNaN(Number(k)) ? (!!name ? name + "." : "") + k : name + "[" + k + "]")), false); });
}
var SimpleRpc = /** @class */ (function () {
    function SimpleRpc() {
    }
    SimpleRpc.prototype.url = function (controllerPath, action, data) {
        if (data === void 0) { data = {}; }
        var url = new URL("/".concat(controllerPath, ".php?do=").concat(action), location.href);
        var dataKvs = kvs(data);
        dataKvs.forEach(function (kv) {
            var name = kv.name;
            name = name.replace(/\[/g, ".");
            name = name.replace(/\]/g, "");
            name = name.replace(/\./g, "__dot__");
            url.searchParams.append(name, String(kv.value));
        });
        return url.toString();
    };
    SimpleRpc.prototype.call = function (controllerPath, action, data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var url, dataKvs, body, res, rDataText, rDataTextTrim, rData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.url(controllerPath, action);
                        dataKvs = kvs(data);
                        body = new FormData();
                        dataKvs.forEach(function (kv) {
                            var _a;
                            var name = kv.name;
                            name = name.replace(/\[/g, ".");
                            name = name.replace(/\]/g, "");
                            name = name.replace(/\./g, "__dot__");
                            if (!!kv.file) {
                                body.append(name, kv.file, kv.fileName);
                                return;
                            }
                            body.append(name, String((_a = kv.value) !== null && _a !== void 0 ? _a : ""));
                        });
                        return [4 /*yield*/, fetch(url, {
                                method: "post",
                                body: body,
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.text()];
                    case 2:
                        rDataText = _a.sent();
                        rDataTextTrim = rDataText.replace(/^[^\{]+/, '');
                        rData = JSON.parse(rDataTextTrim);
                        if (rData === null || rData === void 0 ? void 0 : rData.exception) {
                            throw new Exception_1.Exception(rData.exception);
                        }
                        return [2 /*return*/, rData];
                }
            });
        });
    };
    SimpleRpc.prototype.controller = function (controllerPath) {
        var _this = this;
        var proxy = new Proxy({}, {
            get: function (_target, action) {
                if (action === "url") {
                    return function (action, data) {
                        if (data === void 0) { data = {}; }
                        return _this.url(controllerPath, action, data);
                    };
                }
                return function (data) {
                    if (data === void 0) { data = {}; }
                    return _this.call(controllerPath, String(action), data);
                };
            },
        });
        return proxy;
    };
    SimpleRpc.prototype.controllerUrl = function (controllerPath) {
        var _this = this;
        var proxy = new Proxy({}, {
            get: function (_target, action) {
                return function (data) {
                    if (data === void 0) { data = {}; }
                    return _this.url(controllerPath, String(action), data);
                };
            },
        });
        return proxy;
    };
    return SimpleRpc;
}());
exports.SimpleRpc = SimpleRpc;
