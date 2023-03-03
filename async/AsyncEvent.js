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
exports.BroadcastAsyncEventRegister = exports.AsyncEvent = void 0;
var ArrayUtil_1 = require("../value/ArrayUtil");
var AsyncEvent = /** @class */ (function () {
    function AsyncEvent(defaultValue) {
        var _this = this;
        if (defaultValue === void 0) { defaultValue = function () { return undefined; }; }
        this.defaultValue = defaultValue;
        this.listeners = [];
        this.register = {
            add: function (listener) { return _this.add(listener); },
            remove: function (listener) { return _this.remove(listener); },
            removeAdd: function (listener) { return _this.removeAdd(listener); },
            has: function (listener) { return _this.has(listener); },
            regist: function (listener) { return _this.regist(listener); },
        };
    }
    AsyncEvent.prototype.trigger = function (value) {
        if (value === void 0) { value = this.defaultValue(); }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, listener, controller, listenerResult, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(this.listeners.slice().reverse()), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        listener = _b.value;
                        controller = {
                            value: value,
                            resultList: [],
                            result: function (result) {
                                this.resultList.push(result);
                                return result;
                            },
                            resultCheck: function (value) {
                                return this.resultList.indexOf(value) >= 0;
                            },
                        };
                        return [4 /*yield*/, listener(value, controller)];
                    case 2:
                        listenerResult = _d.sent();
                        if (controller.resultCheck(listenerResult)) {
                            if (!!listenerResult.value) {
                                value = listenerResult.value[0];
                            }
                            if (!!listenerResult.break) {
                                return [3 /*break*/, 4];
                            }
                            return [3 /*break*/, 3];
                        }
                        if (typeof listenerResult === "undefined") {
                            return [3 /*break*/, 3];
                        }
                        value = listenerResult;
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/, value];
                }
            });
        });
    };
    AsyncEvent.prototype.add = function (listener) {
        if (this.has(listener)) {
            return false;
        }
        this.listeners.push(listener);
        return true;
    };
    AsyncEvent.prototype.remove = function (listener) {
        var index = this.listeners.indexOf(listener);
        return this.listeners.splice(index, 1).length > 0;
    };
    AsyncEvent.prototype.removeAdd = function (listener) {
        return this.remove(listener) && this.add(listener);
    };
    AsyncEvent.prototype.has = function (listener) {
        return ArrayUtil_1.ArrayUtil.contains(this.listeners, listener);
    };
    AsyncEvent.prototype.clear = function () {
        this.listeners.splice(0);
    };
    AsyncEvent.prototype.regist = function (listener) {
        var _this = this;
        this.add(listener);
        var unregist = function () {
            _this.remove(listener);
        };
        return unregist;
    };
    return AsyncEvent;
}());
exports.AsyncEvent = AsyncEvent;
var BroadcastAsyncEventRegister = /** @class */ (function () {
    function BroadcastAsyncEventRegister(list) {
        this.list = list;
    }
    BroadcastAsyncEventRegister.prototype.add = function (listener) {
        var reduce = this.list.reduce(function (pre, cur) {
            return cur.add(listener) || pre;
        }, false);
        return reduce;
    };
    BroadcastAsyncEventRegister.prototype.remove = function (listener) {
        var reduce = this.list.reduce(function (pre, cur) {
            return cur.remove(listener) || pre;
        }, false);
        return reduce;
    };
    BroadcastAsyncEventRegister.prototype.removeAdd = function (listener) {
        var reduce = this.list.reduce(function (pre, cur) {
            return cur.removeAdd(listener) || pre;
        }, false);
        return reduce;
    };
    BroadcastAsyncEventRegister.prototype.has = function (listener) {
        return this.list.some(function (a) { return a.has(listener); });
    };
    BroadcastAsyncEventRegister.prototype.regist = function (listener) {
        return this.list.reduce(function (pre, cur) {
            var dispose = cur.regist(listener);
            return function () {
                pre();
                dispose();
            };
        }, function () { });
    };
    return BroadcastAsyncEventRegister;
}());
exports.BroadcastAsyncEventRegister = BroadcastAsyncEventRegister;
