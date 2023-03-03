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
exports.HashMap = void 0;
var Comparer_1 = require("./Comparer");
var HashMap = /** @class */ (function () {
    function HashMap(comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        this.buckets = {};
        this.sizeValue = 0;
        this.comparer = comparer;
    }
    HashMap.from = function (array, keySelector, valueSelector, comparer, action) {
        if (keySelector === void 0) { keySelector = function (a) { return a; }; }
        if (valueSelector === void 0) { valueSelector = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (action === void 0) { action = "add"; }
        var instance = new HashMap(comparer);
        instance.fromArray(array, keySelector, valueSelector, action);
        return instance;
    };
    HashMap.prototype.fromArray = function (array, keySelector, valueSelector, action) {
        var e_1, _a;
        if (keySelector === void 0) { keySelector = function (a) { return a; }; }
        if (valueSelector === void 0) { valueSelector = function (a) { return a; }; }
        if (action === void 0) { action = "add"; }
        try {
            for (var array_1 = __values(array), array_1_1 = array_1.next(); !array_1_1.done; array_1_1 = array_1.next()) {
                var item = array_1_1.value;
                var key = keySelector(item);
                var value = valueSelector(item);
                this[action](key, value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    HashMap.prototype.fromClone = function (old, action) {
        if (action === void 0) { action = "add"; }
        this.fromArray(old.toArray(), function (a) { return a.key; }, function (a) { return a.value; }, action);
    };
    HashMap.prototype.add = function (key, value) {
        var hashCode = this.comparer.getHashCode(key);
        var bucket = this.buckets[hashCode];
        if (!bucket) {
            bucket = [];
            this.buckets[hashCode] = bucket;
        }
        for (var i = 0; i < bucket.length; ++i) {
            if (this.comparer.equals(bucket[i].key, key)) {
                throw new Error(JSON.stringify({
                    key: key,
                }, undefined, "  "));
            }
        }
        bucket.push({ key: key, value: value });
        this.sizeValue++;
    };
    HashMap.prototype.put = function (key, value) {
        var hashCode = this.comparer.getHashCode(key);
        var bucket = this.buckets[hashCode];
        if (!bucket) {
            bucket = [];
            this.buckets[hashCode] = bucket;
        }
        for (var i = 0; i < bucket.length; ++i) {
            if (this.comparer.equals(bucket[i].key, key)) {
                bucket[i].value = value;
                return;
            }
        }
        bucket.push({ key: key, value: value });
        this.sizeValue++;
    };
    HashMap.prototype.remove = function (key) {
        var hashCode = this.comparer.getHashCode(key);
        var bucket = this.buckets[hashCode];
        if (!bucket) {
            return false;
        }
        for (var i = 0; i < bucket.length; ++i) {
            if (this.comparer.equals(bucket[i].key, key)) {
                bucket.splice(i, 1);
                this.sizeValue--;
                return true;
            }
        }
        return false;
    };
    HashMap.prototype.clear = function () {
        this.buckets = {};
        this.sizeValue = 0;
    };
    HashMap.prototype.entry = function (key) {
        var hashCode = this.comparer.getHashCode(key);
        var bucket = this.buckets[hashCode];
        if (!bucket) {
            return undefined;
        }
        for (var i = 0; i < bucket.length; ++i) {
            if (this.comparer.equals(bucket[i].key, key)) {
                var entry = bucket[i];
                return entry;
            }
        }
        return undefined;
    };
    HashMap.prototype.get = function (key) {
        var entry = this.entry(key);
        if (!entry) {
            throw new Error(JSON.stringify({
                key: key,
            }, undefined, "  "));
        }
        return entry.value;
    };
    HashMap.prototype.getOrDefault = function (key, defaultFactory) {
        if (defaultFactory === void 0) { defaultFactory = function () { return undefined; }; }
        var entry = this.entry(key);
        if (!entry) {
            return defaultFactory();
        }
        return entry.value;
    };
    HashMap.prototype.getOrPut = function (key, factory) {
        var entry = this.entry(key);
        if (!entry) {
            var value = factory(key);
            this.put(key, value);
            return value;
        }
        return entry.value;
    };
    HashMap.prototype.getOrPutAs = function (key, factory) {
        var entry = this.entry(key);
        if (!entry) {
            var value = factory(key);
            this.put(key, value);
            return value;
        }
        return entry.value;
    };
    HashMap.prototype.has = function (key) {
        var entry = this.entry(key);
        return !!entry;
    };
    HashMap.prototype.entries = function () {
        var _this = this;
        var bucketsKeys = Object.keys(this.buckets);
        var entries = bucketsKeys.flatMap(function (cur) { return _this.buckets[cur]; });
        return entries;
    };
    HashMap.prototype.keys = function () {
        return this.entries().map(function (a) { return a.key; });
    };
    HashMap.prototype.values = function () {
        return this.entries().map(function (a) { return a.value; });
    };
    HashMap.prototype.toArray = function () {
        return this.entries();
    };
    HashMap.prototype.size = function () {
        return this.sizeValue;
    };
    HashMap.prototype.count = function () {
        var _this = this;
        var bucketsKeys = Object.keys(this.buckets);
        var size = bucketsKeys.map(function (cur) { return _this.buckets[cur].length; }).
            reduce(function (pre, cur) { return pre + cur; }, 0);
        return size;
    };
    return HashMap;
}());
exports.HashMap = HashMap;
