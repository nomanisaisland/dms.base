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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rjMy = exports.rjMyPlus = void 0;
var RecordUtil_1 = require("../value/RecordUtil");
function rjMyFunc(target) {
    var mock = undefined;
    var proxy = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!!mock) {
            return mock.apply(void 0, __spreadArray([], __read(args), false));
        }
        var promiseResolve;
        var promiseReject;
        var promise = new Promise(function (resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        var rawOptions = args[0];
        var options = args.length > 0 && typeof rawOptions !== "object" ?
            rawOptions : __assign(__assign({}, rawOptions), { success: function () {
                var successArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    successArgs[_i] = arguments[_i];
                }
                if (!!rawOptions && !!rawOptions.success) {
                    rawOptions.success.apply(rawOptions, __spreadArray([], __read(successArgs), false));
                }
                promiseResolve.apply(void 0, __spreadArray([], __read(successArgs), false));
            }, fail: function () {
                var failArgs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    failArgs[_i] = arguments[_i];
                }
                if (!!rawOptions && !!rawOptions.fail) {
                    rawOptions.fail.apply(rawOptions, __spreadArray([], __read(failArgs), false));
                }
                promiseReject.apply(void 0, __spreadArray([], __read(failArgs), false));
            } });
        var rawReturn = target.apply(undefined, __spreadArray([options], __read(args.slice(1)), false));
        if (rawReturn !== undefined) {
            return rawReturn;
        }
        return promise;
    };
    proxy.mockOn = function (handler) {
        mock = typeof handler === "function" ? handler : function () { return handler; };
    };
    proxy.mockOff = function () {
        mock = undefined;
    };
    proxy.mockOne = function (handler) {
        var currentMock = mock;
        mock = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            mock = currentMock;
            var handlerFunc = typeof handler === "function" ? handler : function () { return handler; };
            return handlerFunc.apply(void 0, __spreadArray([], __read(args), false));
        };
    };
    return proxy;
}
function rjMyObject(target, depth) {
    if (depth === void 0) { depth = 10; }
    if (depth < 0) {
        return target;
    }
    var proxy = Object.keys(target).reduce(function (pre, cur) {
        var childTarget = target[cur];
        var childProxy = typeof childTarget === "object" ?
            rjMyObject(childTarget, depth - 1) :
            typeof childTarget === "function" ?
                rjMyFunc(childTarget) :
                childTarget;
        pre[cur] = childProxy;
        return pre;
    }, {});
    return proxy;
}
var rjMyRaw = my;
exports.rjMyPlus = {
    /**
     * 将对象查询参数字符串 {id:1,items:[{id:1,}]} => "id=1&items[0].id=1"
     */
    navigateQuery: function (data) {
        function kvs(data, name) {
            if (name === void 0) { name = ""; }
            if (!data ||
                typeof data === "string" ||
                typeof data === "number" ||
                typeof data === "boolean" ||
                typeof data === "bigint") {
                return [{ name: name, value: data !== null && data !== void 0 ? data : "", }];
            }
            return Object.keys(data).flatMap(function (k) { return __spreadArray([], __read(kvs(data[k], Number.isNaN(Number(k)) ? (!!name ? name + "." : "") + k : name + "[" + k + "]")), false); });
        }
        var dataKvs = kvs(data);
        var query = dataKvs.map(function (a) { return "".concat(encodeURIComponent(a.name), "=").concat(encodeURIComponent(a.value)); }).join("&");
        return !!query ? "?" + query : "";
    },
    /**
     * 在页面中onload中使用，将query还原回navigateQuery前的对象
     */
    navigateProps: function (query) {
        var props = Object.keys(query).reduce(function (pre, name) {
            var keyPath = RecordUtil_1.RecordPathUtil.pathFromString(name);
            var v = query[name];
            var cur = RecordUtil_1.RecordPathUtil.pathSet(pre, keyPath, v);
            return cur;
        }, {});
        return props;
    },
    /**
     * 拼接打开小程序的链接，可以指定启动参数和启动页面
     */
    navigateAppLink: function (options) {
        var url = "https://m.duanqu.com/?_ariver_appid=".concat(options.appid);
        if (!!options.queryParams) {
            var q = "params=".concat(encodeURIComponent(JSON.stringify(options.queryParams)));
            url += "&query=".concat(encodeURIComponent(q));
        }
        if (!!options.page) {
            url += "&page=".concat(encodeURIComponent(options.page));
        }
        return url;
    },
};
exports.rjMy = rjMyObject(rjMyRaw);
Object.assign(exports.rjMy, __assign(__assign({ tb: rjMyObject(my.tb || {}), qn: rjMyObject(my.qn || {}), rjMyRaw: rjMyRaw, rjMy: exports.rjMy, rjMyPlus: exports.rjMyPlus }, exports.rjMyPlus), { globalOn: function () {
        //todo subPackage
        my = exports.rjMy;
    } }));
my.rjMy = exports.rjMy;
