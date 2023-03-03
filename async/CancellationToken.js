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
exports.cancelTokenRefCreate = exports.cancelTokenLink = exports.SourceCancellationToken = exports.CancellationToken = void 0;
var Exception_1 = require("../value/Exception");
var CancellationToken = /** @class */ (function () {
    function CancellationToken() {
        /**
         * 标识是否已经取消
         */
        this.requested = false;
        this.callbackList = undefined;
    }
    CancellationToken.prototype.throwIfRequested = function () {
        if (this.requested) {
            throw new Exception_1.OperationCanceledException(String(this.requestMessage), this.requestMessage);
        }
    };
    CancellationToken.prototype.register = function (callback) {
        if (this.requested) {
            callback(this.requestMessage);
            return function () { };
        }
        if (!this.callbackList) {
            this.callbackList = [];
        }
        var callbackList = this.callbackList;
        var removed = false;
        var wrap = function (requestMessage) {
            if (removed) {
                return;
            }
            callback(requestMessage);
        };
        callbackList.push(wrap);
        return function () {
            removed = true;
        };
    };
    CancellationToken.prototype.cancelProtected = function (requestMessage) {
        void requestMessage;
    };
    CancellationToken.noneValue = new CancellationToken();
    CancellationToken.none = function () {
        return this.noneValue;
    };
    return CancellationToken;
}());
exports.CancellationToken = CancellationToken;
var SourceCancellationToken = /** @class */ (function (_super) {
    __extends(SourceCancellationToken, _super);
    function SourceCancellationToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 取消
     */
    SourceCancellationToken.prototype.cancel = function (requestMessage) {
        var e_1, _a;
        if (this.requested) {
            return;
        }
        this.requested = true;
        this.requestMessage = requestMessage;
        if (!!this.callbackList) {
            try {
                for (var _b = __values(this.callbackList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var callback = _c.value;
                    callback(this.requestMessage);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.callbackList = undefined;
        }
    };
    return SourceCancellationToken;
}(CancellationToken));
exports.SourceCancellationToken = SourceCancellationToken;
var cancelTokenLink = function (ct1, ct2) {
    var ct = new SourceCancellationToken();
    ct1.register(function () {
        ct.cancel();
    });
    ct2.register(function () {
        ct.cancel();
    });
    return ct;
};
exports.cancelTokenLink = cancelTokenLink;
function cancelTokenRefCreate() {
    var ctRef = {
        current: new SourceCancellationToken(),
        cut: function (requestMessage) {
            ctRef.current.cancel(requestMessage);
            ctRef.current = new SourceCancellationToken();
            return ctRef.current;
        },
    };
    return ctRef;
}
exports.cancelTokenRefCreate = cancelTokenRefCreate;
