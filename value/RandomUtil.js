"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomUtil = void 0;
var RandomUtil = /** @class */ (function () {
    function RandomUtil() {
    }
    RandomUtil.timeString = function () {
        return new Date().getTime().toString();
    };
    RandomUtil.saltString = function () {
        return Math.floor(Math.random() * 1000).toString();
    };
    RandomUtil.timeSaltString = function () {
        return "".concat(this.timeString(), "_").concat(this.saltString());
    };
    RandomUtil.guidStringD = function () {
        function s4() {
            return (((Math.random() + 1) * 0x10000) | 0).toString(16).substring(1);
        }
        return (s4() + s4() + "-" +
            s4() + "-" +
            s4() + "-" +
            s4() + "-" +
            s4() + s4() + s4());
    };
    RandomUtil.guidStringN = function () {
        function s4() {
            return (((Math.random() + 1) * 0x10000) | 0).toString(16).substring(1);
        }
        return (s4() + s4() +
            s4() +
            s4() +
            s4() +
            s4() + s4() + s4());
    };
    RandomUtil.mixStr = function (len, pool) {
        if (len === void 0) { len = 6; }
        if (pool === void 0) { pool = "abcdefghkmnpqrstuvwxyz123456789"; }
        var res = "";
        for (var i = 0; i < len; i++) {
            var idx = Math.ceil(Math.random() * pool.length);
            res += pool.charAt(idx);
        }
        return res;
    };
    return RandomUtil;
}());
exports.RandomUtil = RandomUtil;
