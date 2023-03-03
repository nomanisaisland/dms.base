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
exports.ArrayEffectUtil = exports.ArrayUtil = void 0;
var Comparer_1 = require("./Comparer");
var ArrayUtil = /** @class */ (function () {
    function ArrayUtil() {
    }
    ArrayUtil.containsAll = function (input, items, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        var output = items.every(function (item) {
            return ArrayUtil.contains(input, item, comparer);
        });
        return output;
    };
    ArrayUtil.contains = function (input, item, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        var output = input.some(function (a) {
            return comparer.equals(a, item);
        });
        return output;
    };
    ArrayUtil.distinct = function (input, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        var output = input.filter(function (a, i) { return input.findIndex(function (aa) { return comparer.compare(aa, a) === 0; }) === i; });
        return output;
    };
    ArrayUtil.orderByQuickSort = function (input, selector, comparer) {
        if (selector === void 0) { selector = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (input.length < 2) {
            return input.slice();
        }
        var _a = input.slice(1).reduce(function (_a, cur) {
            var l = _a.l, m = _a.m, r = _a.r;
            return comparer.compare(selector(cur), selector(m[0])) < 0 ?
                { l: __spreadArray(__spreadArray([], __read(l), false), [cur], false), m: m, r: r, } :
                { l: l, m: m, r: __spreadArray(__spreadArray([], __read(r), false), [cur], false), };
        }, { l: [], m: input.slice(0, 1), r: [] }), l = _a.l, m = _a.m, r = _a.r;
        return __spreadArray(__spreadArray(__spreadArray([], __read(this.orderByQuickSort(l, selector, comparer)), false), __read(m), false), __read(this.orderByQuickSort(r, selector, comparer)), false);
    };
    ArrayUtil.orderBy = function (input, selector, comparer, chaos) {
        if (selector === void 0) { selector = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (chaos === void 0) { chaos = false; }
        if (!chaos) {
            return this.orderByQuickSort(input, selector, comparer);
        }
        var output = input.map(function (source) { return ({
            source: source,
            sort: selector(source),
        }); }).sort(function (a, b) { return comparer.compare(a.sort, b.sort); }).map(function (a) { return a.source; });
        return output;
    };
    ArrayUtil.orderByDesc = function (input, selector, comparer, chaos) {
        if (selector === void 0) { selector = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (chaos === void 0) { chaos = false; }
        var output = ArrayUtil.orderBy(input, selector, comparer, chaos).reverse();
        return output;
    };
    ArrayUtil.sum = function (input, map, add, initValue) {
        if (map === void 0) { map = function (a) { return a; }; }
        if (add === void 0) { add = function (a, b) { return a + b; }; }
        if (initValue === void 0) { initValue = 0; }
        return input.reduce(function (pre, cur) { return add(pre, map(cur)); }, initValue);
    };
    ArrayUtil.max = function (input, map, comparer, initValue) {
        if (map === void 0) { map = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (initValue === void 0) { initValue = undefined; }
        if (input.length < 1) {
            return initValue;
        }
        return input.reduce(function (pre, cur) {
            var mapedCur = map(cur);
            return comparer.compare(pre, mapedCur) > 0 ? pre : mapedCur;
        }, map(input[0]));
    };
    ArrayUtil.min = function (input, map, comparer, initValue) {
        if (map === void 0) { map = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (initValue === void 0) { initValue = undefined; }
        if (input.length < 1) {
            return initValue;
        }
        return input.reduce(function (pre, cur) {
            var mapedCur = map(cur);
            return comparer.compare(pre, mapedCur) < 0 ? pre : mapedCur;
        }, map(input[0]));
    };
    ArrayUtil.groupBy = function (input, keySelector, comparer) {
        if (keySelector === void 0) { keySelector = function (a) { return a; }; }
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        var output = [];
        var _loop_1 = function (i) {
            var item = input[i];
            var key = keySelector(item, i);
            var groupIndex = output.findIndex(function (a) { return comparer.equals(a.key, key); });
            if (groupIndex < 0) {
                output.push({ key: key, list: [item] });
                return "continue";
            }
            var group = output[groupIndex];
            group.list.push(item);
        };
        for (var i = 0; i < input.length; i++) {
            _loop_1(i);
        }
        return output;
    };
    ArrayUtil.range = function (max, min) {
        if (min === void 0) { min = 0; }
        return __spreadArray([
            min
        ], __read(min < max ? this.range(min + 1, max) : []), false);
    };
    return ArrayUtil;
}());
exports.ArrayUtil = ArrayUtil;
var ArrayEffectUtil = /** @class */ (function () {
    function ArrayEffectUtil() {
    }
    ArrayEffectUtil.remove = function (input, item, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        var index = input.findIndex(function (a) {
            return comparer.compare(a, item) === 0;
        });
        if (index < 0) {
            return false;
        }
        input.splice(index, 1);
        return true;
    };
    ArrayEffectUtil.removeAll = function (input, items) {
        var e_1, _a;
        var removed = [];
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                if (this.remove(input, item)) {
                    removed.push(item);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return removed;
    };
    ArrayEffectUtil.removeFilter = function (input, predicate) {
        var items = input.filter(predicate);
        return this.removeAll(input, items);
    };
    ArrayEffectUtil.removeFilterEq = function (input, item, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        return this.removeFilter(input, function (a) { return comparer.compare(a, item) === 0; });
    };
    ArrayEffectUtil.clear = function (input) {
        input.splice(0);
    };
    return ArrayEffectUtil;
}());
exports.ArrayEffectUtil = ArrayEffectUtil;
