"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var MpSimpleState_1 = require("../../MpSimpleState");
MpSimpleState_1.MpSimpleState.Component({
    props: {
        loading: false,
        className: "",
        style: "",
    },
    onInit: function () {
        var component = this;
        var _a = MpSimpleState_1.MpSimpleState.stateControl({}, component), state = _a.state, stateControl = __rest(_a, ["state"]);
        stateControl.update();
    },
});
