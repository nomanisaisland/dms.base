"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringComparer = /** @class */ (function () {
    function StringComparer(ignoreCase) {
        if (ignoreCase === void 0) { ignoreCase = false; }
        this.ignoreCase = ignoreCase;
    }
    StringComparer.prototype.equals = function (x, y) {
        if (this.ignoreCase) {
            x = x === null || x === void 0 ? void 0 : x.toUpperCase();
            y = y === null || y === void 0 ? void 0 : y.toUpperCase();
        }
        return x === y;
    };
    StringComparer.prototype.getHashCode = function (obj) {
        if (this.ignoreCase) {
            obj = obj === null || obj === void 0 ? void 0 : obj.toUpperCase();
        }
        if (!obj) {
            obj = "";
        }
        var hash = 0;
        for (var i = 0; i < obj.length; i++) {
            hash = (((hash << 5) - hash) + obj.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
    };
    StringComparer.prototype.compare = function (x, y) {
        if (this.ignoreCase) {
            x = x === null || x === void 0 ? void 0 : x.toUpperCase();
            y = y === null || y === void 0 ? void 0 : y.toUpperCase();
        }
        return x === y ? 0 : x > y ? 1 : -1;
    };
    StringComparer.ordinal = new StringComparer();
    StringComparer.ordinalIgnoreCase = new StringComparer(true);
    return StringComparer;
}());
exports.default = StringComparer;
