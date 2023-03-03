"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyKeyComparer = void 0;
var CompareUtil_1 = require("./CompareUtil");
var PropertyKeyComparer = /** @class */ (function (_super) {
    __extends(PropertyKeyComparer, _super);
    function PropertyKeyComparer() {
        return _super.call(this, PropertyKeyComparer.memberPropertyKey) || this;
    }
    PropertyKeyComparer.memberPropertyKey = function (key) {
        if (typeof key === "symbol") {
            return key;
        }
        return String(key);
    };
    PropertyKeyComparer.instance = new PropertyKeyComparer();
    return PropertyKeyComparer;
}(CompareUtil_1.SelectComparer));
exports.PropertyKeyComparer = PropertyKeyComparer;
