"use strict";
/*
 * @Author: lujiafeng
 * @Date: 2022-07-28 16:01:21
 * @LastEditTime: 2022-07-28 16:22:13
 * @LastEditors: lujiafeng
 * @Description:
 * @FilePath: \myWebsite\dms.base\utils\Performance.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmsPerform = void 0;
var DmsPerform = /** @class */ (function () {
    function DmsPerform() {
    }
    /**
     * @description 节流（隔一段时间去执行一次代码,没到时间则不执行,并且第一次是直接执行的）
     * @param fn
     * @param timer
     */
    DmsPerform.throttle = function (fn, time) {
        if (time === void 0) { time = 500; }
        var timer = null;
        return function (rest) {
            var _this = this;
            if (timer)
                return;
            timer = setTimeout(function () {
                fn.call(_this, rest);
                timer = null;
            }, time);
        };
    };
    return DmsPerform;
}());
exports.DmsPerform = DmsPerform;
