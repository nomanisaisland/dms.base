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
exports.OperationCanceledException = exports.AnonymException = exports.InvalidOperationException = exports.NotImplementedException = exports.NotSupportedException = exports.Exception = void 0;
var Exception = /** @class */ (function (_super) {
    __extends(Exception, _super);
    function Exception(message, messageData) {
        if (messageData === void 0) { messageData = undefined; }
        var _this = _super.call(this, message) || this;
        _this.messageData = messageData;
        var newTarget = _this.constructor;
        if (!(_this instanceof newTarget)) {
            Reflect.setPrototypeOf(_this, newTarget.prototype);
        }
        return _this;
    }
    Exception.prototype.throw = function () {
        throw this;
    };
    return Exception;
}(Error));
exports.Exception = Exception;
var NotSupportedException = /** @class */ (function (_super) {
    __extends(NotSupportedException, _super);
    function NotSupportedException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotSupportedException;
}(Exception));
exports.NotSupportedException = NotSupportedException;
var NotImplementedException = /** @class */ (function (_super) {
    __extends(NotImplementedException, _super);
    function NotImplementedException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotImplementedException;
}(Exception));
exports.NotImplementedException = NotImplementedException;
var InvalidOperationException = /** @class */ (function (_super) {
    __extends(InvalidOperationException, _super);
    function InvalidOperationException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidOperationException;
}(Exception));
exports.InvalidOperationException = InvalidOperationException;
var AnonymException = /** @class */ (function (_super) {
    __extends(AnonymException, _super);
    function AnonymException(value) {
        var _this = _super.call(this, AnonymException.valueMessage(value)) || this;
        _this.value = value;
        return _this;
    }
    AnonymException.valueMessage = function (value) {
        return JSON.stringify(value);
    };
    AnonymException.errorFrom = function (value) {
        var error = value instanceof Error ?
            value : new this(value);
        return error;
    };
    AnonymException.exceptionFrom = function (value) {
        var error = value instanceof Exception ?
            value : new this(value);
        return error;
    };
    return AnonymException;
}(Exception));
exports.AnonymException = AnonymException;
var OperationCanceledException = /** @class */ (function (_super) {
    __extends(OperationCanceledException, _super);
    function OperationCanceledException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OperationCanceledException;
}(Exception));
exports.OperationCanceledException = OperationCanceledException;
