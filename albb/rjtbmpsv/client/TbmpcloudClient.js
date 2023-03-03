"use strict";
//应在启动时注入 @tbmp/mp-cloud-sdk 的实例
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
exports.cloudCurrent = exports.cloudSetup = exports.cloud = void 0;
exports.cloud = Reflect.get(Reflect, "TbmpcloudClientCloud");
var setupListImpl = [];
var setupList = Reflect.get(Reflect, "TbmpcloudClientCloudSetupList") ||
    (Reflect.set(Reflect, "TbmpcloudClientCloudSetupList", setupListImpl), setupListImpl);
setupList.push(function (value) {
    exports.cloud = value;
});
function cloudSetup(value) {
    var e_1, _a;
    Reflect.set(Reflect, "TbmpcloudClientCloud", value);
    try {
        for (var setupList_1 = __values(setupList), setupList_1_1 = setupList_1.next(); !setupList_1_1.done; setupList_1_1 = setupList_1.next()) {
            var setup = setupList_1_1.value;
            setup(value);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (setupList_1_1 && !setupList_1_1.done && (_a = setupList_1.return)) _a.call(setupList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.cloudSetup = cloudSetup;
function cloudCurrent() {
    return exports.cloud;
}
exports.cloudCurrent = cloudCurrent;
