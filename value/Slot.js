"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncSlot = exports.Slot = void 0;
var Slot = /** @class */ (function () {
    function Slot(value) {
        this.value = value;
    }
    return Slot;
}());
exports.Slot = Slot;
var FuncSlot = /** @class */ (function () {
    function FuncSlot(get, set) {
        var _this = this;
        if (set === void 0) { set = function (value) {
            _this.get = function () { return value; };
        }; }
        this.get = get;
        this.set = set;
    }
    Object.defineProperty(FuncSlot.prototype, "value", {
        get: function () {
            return this.get();
        },
        set: function (value) {
            this.set(value);
        },
        enumerable: false,
        configurable: true
    });
    return FuncSlot;
}());
exports.FuncSlot = FuncSlot;
