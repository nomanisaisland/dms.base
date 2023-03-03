"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayComparer = void 0;
var Comparer_1 = require("./Comparer");
var ArrayComparer = /** @class */ (function () {
    function ArrayComparer(comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        this.comparer = comparer;
    }
    ArrayComparer.staticCompare = function (x, y, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (x === y) {
            return 0;
        }
        var xIndex = 0;
        var yIndex = 0;
        while (xIndex < x.length && yIndex < y.length) {
            var xValue = x[xIndex];
            var yValue = y[yIndex];
            var elementResult = comparer.compare(xValue, yValue);
            if (elementResult != 0) {
                return elementResult;
            }
            xIndex++;
            yIndex++;
        }
        if (xIndex < x.length) {
            return 1;
        }
        if (yIndex < y.length) {
            return -1;
        }
        return 0;
    };
    ArrayComparer.staticEquals = function (x, y, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        if (x === y) {
            return true;
        }
        var xIndex = 0;
        var yIndex = 0;
        while (xIndex < x.length && yIndex < y.length) {
            var xValue = x[xIndex];
            var yValue = y[yIndex];
            var elementResult = comparer.equals(xValue, yValue);
            if (!elementResult) {
                return elementResult;
            }
            xIndex++;
            yIndex++;
        }
        if (xIndex < x.length) {
            return false;
        }
        if (yIndex < y.length) {
            return false;
        }
        return true;
    };
    ArrayComparer.staticGetHashCode = function (obj, comparer) {
        if (comparer === void 0) { comparer = Comparer_1.DefaultComparer.instance; }
        var sum = obj.map(function (a) { return comparer.getHashCode(a); }).
            reduce(function (pre, cur) { return pre + cur; }, 0);
        return sum;
    };
    ArrayComparer.prototype.compare = function (x, y) {
        return ArrayComparer.staticCompare(x, y, this.comparer);
    };
    ArrayComparer.prototype.equals = function (x, y) {
        return ArrayComparer.staticEquals(x, y, this.comparer);
    };
    ArrayComparer.prototype.getHashCode = function (obj) {
        return ArrayComparer.staticGetHashCode(obj, this.comparer);
    };
    ArrayComparer.instance = new ArrayComparer();
    return ArrayComparer;
}());
exports.ArrayComparer = ArrayComparer;
