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
exports.RecordPathUtil = exports.RecordUtil = void 0;
var RecordUtil = /** @class */ (function () {
    function RecordUtil() {
    }
    RecordUtil.deepClone = function (data, filter) {
        if (filter === void 0) { filter = function () { return true; }; }
        if (!data || typeof data !== "object") {
            return data;
        }
        if (Array.isArray(data)) {
            var cloned_1 = data.map(function (a) { return RecordUtil.deepClone(a, filter); });
            return cloned_1;
        }
        var cloned = Object.keys(data).filter(function (p) { return filter(p, data); }).
            reduce(function (pre, cur) {
            var _a;
            return (__assign(__assign({}, pre), (_a = {}, _a[cur] = RecordUtil.deepClone(data[cur], filter), _a)));
        }, {});
        return cloned;
    };
    return RecordUtil;
}());
exports.RecordUtil = RecordUtil;
var RecordPathUtil = /** @class */ (function () {
    function RecordPathUtil() {
    }
    RecordPathUtil.pathIntTest = function (n) {
        return typeof n == 'number' && Number.isSafeInteger(n) ||
            typeof n == 'string' && !!n && Number.isSafeInteger(Number(n));
    };
    RecordPathUtil.pathSet = function (target, path, value) {
        if (path.length < 1) {
            return value;
        }
        var key = path[0];
        var targetObject = !RecordPathUtil.pathIntTest(key) && (!target || Array.isArray(target)) ? __assign({}, target) :
            target !== null && target !== void 0 ? target : [];
        targetObject = (Array.isArray(targetObject) ? __spreadArray([], __read(targetObject), false) : __assign({}, targetObject));
        targetObject[key] = RecordPathUtil.pathSet(targetObject[key], path.slice(1), value);
        return targetObject;
    };
    RecordPathUtil.pathSetEffect = function (target, path, value) {
        if (path.length < 1) {
            return value;
        }
        var key = path[0];
        var targetObject = !RecordPathUtil.pathIntTest(key) &&
            (!target || Array.isArray(target)) ? __assign({}, target) :
            target !== null && target !== void 0 ? target : [];
        targetObject[key] = RecordPathUtil.pathSetEffect(targetObject[key], path.slice(1), value);
        return targetObject;
    };
    RecordPathUtil.pathGet = function (target, path) {
        var data = path.reduce(function (pre, cur) { return !!pre ? pre[cur] : undefined; }, target);
        return data;
    };
    RecordPathUtil.pathStartMatch = function (allKeyPath, startKeyPath) {
        return ((allKeyPath === null || allKeyPath === void 0 ? void 0 : allKeyPath.length) || 0) >= ((startKeyPath === null || startKeyPath === void 0 ? void 0 : startKeyPath.length) || 0) &&
            !!(startKeyPath === null || startKeyPath === void 0 ? void 0 : startKeyPath.every(function (a, i) { return String(a) == String(allKeyPath === null || allKeyPath === void 0 ? void 0 : allKeyPath[i]); }));
    };
    RecordPathUtil.pathMatch = function (a, b) {
        return ((a === null || a === void 0 ? void 0 : a.length) || 0) == ((b === null || b === void 0 ? void 0 : b.length) || 0) && RecordPathUtil.pathStartMatch(a, b);
    };
    RecordPathUtil.pathToString = function (path) {
        return path.join(".");
    };
    RecordPathUtil.pathFromString = function (pathString) {
        return String(pathString !== null && pathString !== void 0 ? pathString : "").replace(/\[/g, ".").replace(/\]/g, "").split(".").filter(function (a) { return !!a; });
    };
    return RecordPathUtil;
}());
exports.RecordPathUtil = RecordPathUtil;
