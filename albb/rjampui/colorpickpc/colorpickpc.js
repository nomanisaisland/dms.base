"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var RecordUtil_1 = require("../../../value/RecordUtil");
var RandomUtil_1 = require("../../../value/RandomUtil");
MpSimpleState_1.MpSimpleState.Component({
    props: {
        alphaEnable: false,
        value: {
            hsl: { h: 0, s: 0, l: 1, a: 1, },
            hex: '#ffffff',
            rgb: { r: 255, g: 255, b: 255, a: 1, },
            hsv: { h: 0, s: 0, v: 1, a: 1, },
            oldHue: 0,
            source: 'rgb',
        },
    },
    onInit: function () {
        var component = this;
        var _a = MpSimpleState_1.MpSimpleState.stateControl({
            inputBtnId: RandomUtil_1.RandomUtil.guidStringN(),
            value: component.props.value,
            get valueText() {
                return !!component.props.alphaEnable && typeof state.value === "object" && typeof state.value.rgb === "object" ?
                    "rgba(".concat(state.value.rgb.r, ", ").concat(state.value.rgb.g, ", ").concat(state.value.rgb.b, ", ").concat(state.value.rgb.a, ")") :
                    typeof state.value === "object" ? state.value.hex : state.value;
            },
            get valueHex() {
                return typeof state.value === "object" ? state.value.hex : state.value;
            },
            deriveDataFromProps: function (nextProps) {
                var value = nextProps.value;
                if (JSON.stringify(value) !== JSON.stringify(state.value)) {
                    state.value = value;
                    stateControl.update();
                }
            },
            change: function (e) {
                var valueObject = RecordUtil_1.RecordUtil.deepClone(e.detail.value, function (p) { return !/\$/.test(p + ""); });
                var typeValue = !component.props.alphaEnable ?
                    valueObject.hex : valueObject;
                state.value = RecordUtil_1.RecordUtil.deepClone(valueObject);
                var event = __assign(__assign({}, e), { detail: {
                        value: RecordUtil_1.RecordUtil.deepClone(typeValue),
                        valueObject: RecordUtil_1.RecordUtil.deepClone(valueObject),
                    }, target: {
                        dataset: __assign(__assign({}, Object.keys(component.props).
                            filter(function (p) { return /^data-/i.test(p); }).
                            map(function (p) { return ({ propsName: p, datasetName: p.replace(/^data-/i, ""), }); }).
                            reduce(function (pre, cur) {
                            var _a;
                            return (__assign(__assign({}, pre), (_a = {}, _a[cur.datasetName] = component.props[cur.propsName], _a)));
                        }, {})), RecordUtil_1.RecordUtil.deepClone(component.props.dataset)),
                    } });
                component.props.onChange(event);
                stateControl.update();
            },
            edit: {
                opened: false,
                open: function (props) {
                    if (props === void 0) { props = {}; }
                    Object.assign(this, props);
                    this.opened = true;
                    stateControl.update();
                },
                close: function () {
                    this.opened = false;
                    stateControl.update();
                },
            },
        }, component), state = _a.state, stateControl = __rest(_a, ["state"]);
        stateControl.update();
    },
});
