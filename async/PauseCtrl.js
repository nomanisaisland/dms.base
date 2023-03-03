"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pauseCtrlCreate = void 0;
var SyncEvent_1 = require("./SyncEvent");
function pauseCtrlCreate() {
    var onResulme = undefined;
    var pauseCtrl = {
        paused: false,
        wait: function () {
            return new Promise(function (resolve) {
                if (!!onResulme) {
                    onResulme.regist(resolve);
                    return;
                }
                resolve();
            });
        },
        pause: function () {
            onResulme = new SyncEvent_1.SyncEvent();
            pauseCtrl.paused = true;
        },
        resume: function () {
            if (!!onResulme) {
                onResulme.trigger();
            }
            onResulme = undefined;
            pauseCtrl.paused = false;
        },
    };
    return pauseCtrl;
}
exports.pauseCtrlCreate = pauseCtrlCreate;
