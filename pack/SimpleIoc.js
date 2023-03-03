"use strict";
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
exports.SimpleIoc = void 0;
var Comparer_1 = require("../value/Comparer");
var HashMap_1 = require("../value/HashMap");
var SimpleIocComapler = /** @class */ (function () {
    function SimpleIocComapler() {
    }
    SimpleIocComapler.prototype.compare = function (x, y) {
        if (!!(x === null || x === void 0 ? void 0 : x.SimpleIocKey)) {
            x = x.SimpleIocKey;
        }
        if (!!(y === null || y === void 0 ? void 0 : y.SimpleIocKey)) {
            y = y.SimpleIocKey;
        }
        return Comparer_1.DefaultComparer.instance.compare(x, y);
    };
    SimpleIocComapler.prototype.equals = function (x, y) {
        if (!!(x === null || x === void 0 ? void 0 : x.SimpleIocKey)) {
            x = x.SimpleIocKey;
        }
        if (!!(y === null || y === void 0 ? void 0 : y.SimpleIocKey)) {
            y = y.SimpleIocKey;
        }
        return Comparer_1.DefaultComparer.instance.equals(x, y);
    };
    SimpleIocComapler.prototype.getHashCode = function (obj) {
        if (!!(obj === null || obj === void 0 ? void 0 : obj.SimpleIocKey)) {
            obj = obj.SimpleIocKey;
        }
        return Comparer_1.DefaultComparer.instance.getHashCode(obj);
    };
    return SimpleIocComapler;
}());
var SimpleIocImpl = /** @class */ (function () {
    function SimpleIocImpl() {
    }
    SimpleIocImpl.resolve = function (type) {
        var _this = this;
        var map = this.resolveMap;
        var key = type;
        if (!map.has(key)) {
            var ctor_1 = type;
            map.put(key, function () { return _this.factorySingle(key, function () { return new ctor_1(); }); });
        }
        var factory = map.get(key);
        return factory();
    };
    SimpleIocImpl.resolveArray = function (type) {
        var key = type;
        var map = this.resolveArrayMap;
        if (!map.has(key)) {
            map.put(key, function () { return []; });
        }
        var factory = map.get(key);
        return factory();
    };
    SimpleIocImpl.singleMap = new HashMap_1.HashMap(new SimpleIocComapler());
    SimpleIocImpl.factorySingle = function (key, factory) {
        var map = this.singleMap;
        if (!map.getOrDefault(key)) {
            map.put(key, factory());
        }
        var value = map.get(key);
        return value;
    };
    SimpleIocImpl.resolveMap = new HashMap_1.HashMap(new SimpleIocComapler());
    SimpleIocImpl.resolveArrayMap = new HashMap_1.HashMap();
    SimpleIocImpl.regist = function (key, impl) {
        var _this = this;
        var map = this.resolveMap;
        map.put(key, function () { return _this.factorySingle(key, function () { return new impl(); }); });
    };
    SimpleIocImpl.registArray = function (key, impl) {
        var _this = this;
        var map = this.resolveArrayMap;
        if (!map.has(key)) {
            map.put(key, function () { return []; });
        }
        var pre = map.get(key)();
        map.put(key, function () { return __spreadArray([_this.resolve(impl)], __read(pre), false); });
    };
    return SimpleIocImpl;
}());
exports.SimpleIoc = Reflect.get(Reflect, "SimpleIoc") ||
    (Reflect.set(Reflect, "SimpleIoc", SimpleIocImpl), SimpleIocImpl);
