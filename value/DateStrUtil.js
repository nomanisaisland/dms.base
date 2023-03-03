"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateStrUtil = void 0;
var DateStrUtil = /** @class */ (function () {
    function DateStrUtil() {
    }
    /**
     * 返回Date对象
     * @param tzUtc 处理时差，false从utc转为local，true不处理，-1从local转utc
     */
    DateStrUtil.norm = function (t, tzUtc) {
        if (tzUtc === void 0) { tzUtc = false; }
        if (!Number.isNaN(Number(t))) {
            t = Number(t);
        }
        if (!t) {
            return undefined;
        }
        var time = new Date(t);
        if (!tzUtc) {
            time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        }
        else if (tzUtc == -1) {
            time.setMinutes(time.getMinutes() + time.getTimezoneOffset());
        }
        return time;
    };
    /**
     * 时间格式，计算时差 yyyy-mm-dd hh:ii:ss
     * @param tzUtc 处理时差，false从utc转为local，true不处理，-1从local转utc
     */
    DateStrUtil.formatAyyyymmddhhiiss = function (t, tzUtc) {
        if (tzUtc === void 0) { tzUtc = false; }
        var time = DateStrUtil.norm(t, tzUtc);
        if (!time) {
            return "";
        }
        var str = time.toJSON().replace(/T/ig, " ").replace(/\..*/, "");
        return str;
    };
    /**
     * 弃用 时间格式，计算时差 yyyy-mm-dd hh:ii:ss
     */
    DateStrUtil.formatLjson = function (t, tzUtc) {
        if (tzUtc === void 0) { tzUtc = false; }
        return DateStrUtil.formatAyyyymmddhhiiss(t, tzUtc);
    };
    /**
   * 时间格式，计算时差 yyyy-mm-dd
   */
    DateStrUtil.formatAyyyymmdd = function (t, tzUtc) {
        if (tzUtc === void 0) { tzUtc = false; }
        return DateStrUtil.formatAyyyymmddhhiiss(t, tzUtc).replace(/\s+.*$/i, "");
    };
    return DateStrUtil;
}());
exports.DateStrUtil = DateStrUtil;
