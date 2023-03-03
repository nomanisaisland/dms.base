"use strict";
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
exports.BroadcastSyncEventRegister = exports.SyncEvent = void 0;
var ArrayUtil_1 = require("../value/ArrayUtil");
var fastIndexMode = true;
var SyncEvent = /** @class */ (function () {
    function SyncEvent(defaultValue) {
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
    SyncEvent.prototype.trigger = function (value) {
        var e_1, _a;
        if (value === void 0) { value = this.defaultValue(); }
        try {
            for (var _b = __values(this.listeners.slice().reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                var controller = {
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
                var listenerResult = listener(value, controller);
                if (controller.resultCheck(listenerResult)) {
                    if (!!listenerResult.value) {
                        value = listenerResult.value[0];
                    }
                    if (!!listenerResult.break) {
                        break;
                    }
                    continue;
                }
                if (typeof listenerResult === "undefined") {
                    continue;
                }
                value = listenerResult;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return value;
    };
    SyncEvent.prototype.add = function (listener) {
        if (this.has(listener)) {
            return false;
        }
        if (fastIndexMode) {
            listener.syncEventFastIndex = this.listeners.length;
        }
        this.listeners.push(listener);
        return true;
    };
    SyncEvent.prototype.remove = function (listener) {
        if (fastIndexMode) {
            if (this.listeners[listener.syncEventFastIndex] != listener) {
                listener.syncEventFastIndex = this.listeners.indexOf(listener);
            }
            this.listeners.splice(listener.syncEventFastIndex, 1);
            for (var i = listener.syncEventFastIndex; i < this.listeners.length; i++) {
                var next = this.listeners[i];
                next.syncEventFastIndex = i;
            }
            return listener.syncEventFastIndex >= 0;
        }
        var index = this.listeners.indexOf(listener);
        return this.listeners.splice(index, 1).length > 0;
    };
    SyncEvent.prototype.removeAdd = function (listener) {
        return this.remove(listener) && this.add(listener);
    };
    SyncEvent.prototype.has = function (listener) {
        var _a;
        if (fastIndexMode) {
            if (this.listeners[(_a = listener.syncEventFastIndex) !== null && _a !== void 0 ? _a : -1] == listener) {
                return true;
            }
        }
        return ArrayUtil_1.ArrayUtil.contains(this.listeners, listener);
    };
    SyncEvent.prototype.clear = function () {
        this.listeners.splice(0);
    };
    SyncEvent.prototype.regist = function (listener) {
        var _this = this;
        this.add(listener);
        var unregist = function () {
            _this.remove(listener);
        };
        return unregist;
    };
    return SyncEvent;
}());
exports.SyncEvent = SyncEvent;
var BroadcastSyncEventRegister = /** @class */ (function () {
    function BroadcastSyncEventRegister(list) {
        this.list = list;
    }
    BroadcastSyncEventRegister.prototype.add = function (listener) {
        var reduce = this.list.reduce(function (pre, cur) {
            return cur.add(listener) || pre;
        }, false);
        return reduce;
    };
    BroadcastSyncEventRegister.prototype.remove = function (listener) {
        var reduce = this.list.reduce(function (pre, cur) {
            return cur.remove(listener) || pre;
        }, false);
        return reduce;
    };
    BroadcastSyncEventRegister.prototype.removeAdd = function (listener) {
        var reduce = this.list.reduce(function (pre, cur) {
            return cur.removeAdd(listener) || pre;
        }, false);
        return reduce;
    };
    BroadcastSyncEventRegister.prototype.has = function (listener) {
        return this.list.some(function (a) { return a.has(listener); });
    };
    BroadcastSyncEventRegister.prototype.regist = function (listener) {
        return this.list.reduce(function (pre, cur) {
            var dispose = cur.regist(listener);
            return function () {
                pre();
                dispose();
            };
        }, function () { });
    };
    return BroadcastSyncEventRegister;
}());
exports.BroadcastSyncEventRegister = BroadcastSyncEventRegister;
