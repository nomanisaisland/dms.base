"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayAsync = void 0;
function delayAsync(time, ct) {
    return new Promise(function (resolve, reject) {
        var t = setTimeout(resolve, time);
        ct === null || ct === void 0 ? void 0 : ct.register(function (m) {
            clearTimeout(t);
            reject(m);
        });
    });
}
exports.delayAsync = delayAsync;
