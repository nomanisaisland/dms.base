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
exports.MapComparer = exports.SelectComparer = void 0;
var Comparer_1 = require("./Comparer");
var SelectComparer = /** @class */ (function () {
    function SelectComparer(selector, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        this.selector = selector;
        this.comparer = comparer;
    }
    SelectComparer.prototype.compare = function (x, y) {
        var xMaped = this.selector(x);
        var yMaped = this.selector(y);
        var compareResult = this.comparer.compare(xMaped, yMaped);
        return compareResult;
    };
    SelectComparer.prototype.equals = function (x, y) {
        var xMaped = this.selector(x);
        var yMaped = this.selector(y);
        return this.comparer.equals(xMaped, yMaped);
    };
    SelectComparer.prototype.getHashCode = function (obj) {
        var mapedValue = this.selector(obj);
        return this.comparer.getHashCode(mapedValue);
    };
    return SelectComparer;
}());
exports.SelectComparer = SelectComparer;
var MapComparer = /** @class */ (function () {
    function MapComparer(model) {
        this.model = model;
        this.entries = Object.entries(this.model);
    }
    MapComparer.prototype.compare = function (x, y) {
        var e_1, _a;
        try {
            for (var _b = __values(this.entries), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                var xValue = x[entry[0]];
                var yValue = y[entry[0]];
                var comparerResult = entry[1].compare(xValue, yValue);
                if (comparerResult !== 0) {
                    return comparerResult;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return 0;
    };
    MapComparer.prototype.equals = function (x, y) {
        var e_2, _a;
        try {
            for (var _b = __values(this.entries), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                var xValue = x[entry[0]];
                var yValue = y[entry[0]];
                if (!entry[1].equals(xValue, yValue)) {
                    return false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return true;
    };
    MapComparer.prototype.getHashCode = function (obj) {
        var hashCodes = this.entries.map(function (entry) { return entry[1].getHashCode(obj[entry[0]]); });
        var sum = hashCodes.reduce(function (pre, cur) { return pre + cur; }, 0);
        return sum;
    };
    return MapComparer;
}());
exports.MapComparer = MapComparer;
