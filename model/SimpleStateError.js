"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStateError = void 0;
var StringComparer_1 = __importDefault(require("../value/StringComparer"));
var Exception_1 = require("../value/Exception");
var SimpleStateError = /** @class */ (function () {
    function SimpleStateError() {
    }
    SimpleStateError.tagEmpty = "";
    SimpleStateError.tagComparer = StringComparer_1.default.ordinalIgnoreCase;
    SimpleStateError.codeEmpty = "";
    SimpleStateError.codeException = "Exception";
    SimpleStateError.codeInvalid = "Invalid";
    SimpleStateError.codeBindInvalid = "BindInvalid";
    SimpleStateError.codeNotFound = "NotFound";
    SimpleStateError.codeDuplicate = "Duplicate";
    SimpleStateError.codeUnauth = "Unauth";
    SimpleStateError.codeComparer = StringComparer_1.default.ordinalIgnoreCase;
    SimpleStateError.fromNotFound = function () {
        var stateError = new this();
        stateError.code = this.codeNotFound;
        return stateError;
    };
    SimpleStateError.fromDuplicate = function () {
        var stateError = new this();
        stateError.code = this.codeDuplicate;
        return stateError;
    };
    SimpleStateError.fromInvalid = function () {
        var stateError = new this();
        stateError.code = this.codeInvalid;
        return stateError;
    };
    SimpleStateError.fromBindInvalid = function () {
        var stateError = new this();
        stateError.code = this.codeBindInvalid;
        return stateError;
    };
    SimpleStateError.fromException = function (exception) {
        var stateError = new this();
        var error = Exception_1.AnonymException.errorFrom(exception);
        stateError.code = this.codeException;
        stateError.message = error.message;
        stateError.stack = error.stack || error.toString();
        stateError.raw = exception;
        return stateError;
    };
    return SimpleStateError;
}());
exports.SimpleStateError = SimpleStateError;
