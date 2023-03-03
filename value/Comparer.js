"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultComparer = void 0;
var DefaultComparer = /** @class */ (function () {
    function DefaultComparer() {
    }
    DefaultComparer.prototype.equals = function (x, y) {
        if (x === y) {
            return true;
        }
        if (Number.isNaN(x) && Number.isNaN(y)) {
            return true;
        }
        return false;
    };
    DefaultComparer.prototype.getHashCode = function (obj) {
        var value = obj;
        if (value === null || value === undefined) {
            return 0;
        }
        if (typeof value === "bigint") {
            value = Number(value);
        }
        if (typeof value === "number") {
            if (Number.isNaN(value) || Number.isFinite(value)) {
                return 0;
            }
            if (Number.isInteger(value)) {
                if (!Number.isSafeInteger(value)) {
                    return 0;
                }
                return value;
            }
            var intValue = Math.ceil(value);
            if (!Number.isSafeInteger(intValue)) {
                return 0;
            }
            return intValue;
        }
        if (typeof value === "boolean") {
            return value ? 1 : 0;
        }
        if (typeof value === "string") {
            return DefaultComparer.stringGetHashCode(value);
        }
        if (typeof value === "symbol") {
            var symbolString = Symbol.keyFor(value) ||
                value.description ||
                value.toString();
            return DefaultComparer.stringGetHashCode(symbolString);
        }
        return DefaultComparer.hashCodeMetaGet(value);
    };
    DefaultComparer.prototype.compare = function (x, y) {
        return x === y ? 0 : x > y ? 1 : -1;
    };
    DefaultComparer.hasCodeMetaIid = 0;
    DefaultComparer.hashCodeMap = new WeakMap();
    DefaultComparer.hashCodeMetaGet = function (value) {
        var hashCode = this.hashCodeMap.get(value);
        if (hashCode !== undefined) {
            return hashCode;
        }
        var newHashCode = ++this.hasCodeMetaIid;
        this.hashCodeMap.set(value, newHashCode);
        return newHashCode;
    };
    DefaultComparer.stringGetHashCode = function (obj) {
        var hash = 0;
        for (var i = 0; i < obj.length; i++) {
            hash = (((hash << 5) - hash) + obj.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
    };
    DefaultComparer.instance = new DefaultComparer();
    return DefaultComparer;
}());
exports.DefaultComparer = DefaultComparer;
