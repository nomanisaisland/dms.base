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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.ValidatorSetup = exports.Validator = exports.MpSimpleState = void 0;
var SimpleStateEntry_1 = require("../model/SimpleStateEntry");
var CancellationToken_1 = require("../async/CancellationToken");
var Exception_1 = require("../value/Exception");
var RecordUtil_1 = require("../value/RecordUtil");
var MpSimpleState = /** @class */ (function () {
    function MpSimpleState() {
    }
    MpSimpleState.stateControl = function (defaultValue, componentOrPage, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, _c = _b.propFilter, propFilter = _c === void 0 ? function (p) { return !/\$/.test(p + ""); } : _c;
        var state = typeof defaultValue === "function" ?
            defaultValue() : defaultValue;
        var stateDict = new SimpleStateEntry_1.SimpleStateDict();
        var stateEntry = SimpleStateEntry_1.SimpleStateEntry.fromCreateSlot(state, stateDict);
        function fieldsMap(stateEntry, name, container) {
            if (name === void 0) { name = []; }
            var k = name[name.length - 1];
            var value = !container ?
                RecordUtil_1.RecordPathUtil.pathGet(state, name) :
                container[0][k];
            var field = {
                name: name,
                value: value,
                stateEntry: stateEntry,
            };
            if (value === undefined ||
                value === null ||
                typeof value !== "object") {
                return [field];
            }
            var childFields = Object.keys(value).
                filter(function (p) { return propFilter(p, value); }).
                flatMap(function (k) { return fieldsMap(stateDict.reflect(SimpleStateEntry_1.SimpleStateKey.from(value, k)), __spreadArray(__spreadArray([], __read(name), false), [k], false), [value]); });
            return __spreadArray([
                __assign(__assign({}, field), { container: true })
            ], __read(childFields), false);
        }
        function updateUnit() {
            return __awaiter(this, void 0, void 0, function () {
                var methods, data, oldFields, oldFields_1, oldFields_1_1, field, key, key, fields, fields_1, fields_1_1, field, containerName, key, container_1, func, simpleState, value, container;
                var e_1, _a, e_2, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            ++versionValue;
                            methods = componentOrPage.methods || (componentOrPage.methods = {});
                            data = {};
                            oldFields = componentOrPage.simpleStateFields || [];
                            try {
                                for (oldFields_1 = __values(oldFields), oldFields_1_1 = oldFields_1.next(); !oldFields_1_1.done; oldFields_1_1 = oldFields_1.next()) {
                                    field = oldFields_1_1.value;
                                    if (!!field.methodName) {
                                        delete methods[field.methodName];
                                        delete componentOrPage[field.methodName];
                                        delete methods["on" + field.methodName];
                                        delete componentOrPage["on" + field.methodName];
                                        if (field.name.length === 1) {
                                            key = field.name[0];
                                            delete methods[key];
                                            delete componentOrPage[key];
                                        }
                                    }
                                    if (field.name.length == 1) {
                                        key = field.name[0];
                                        data[key] = "";
                                        data[key + "$simpleState"] = "";
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (oldFields_1_1 && !oldFields_1_1.done && (_a = oldFields_1.return)) _a.call(oldFields_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            fields = fieldsMap(stateEntry);
                            componentOrPage.simpleStateFields = fields;
                            try {
                                for (fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                                    field = fields_1_1.value;
                                    containerName = field.name.slice(0, field.name.length - 1);
                                    key = field.name[field.name.length - 1] || "";
                                    if (typeof field.value === "function") {
                                        field.methodName = "onSimpleState" +
                                            field.name.map(function (a) { return a.substr(0, 1).toUpperCase() + a.substr(1); }).join("");
                                        container_1 = RecordUtil_1.RecordPathUtil.pathGet(state, containerName);
                                        func = field.value.bind(container_1);
                                        methods[field.methodName] = func;
                                        componentOrPage[field.methodName] = func;
                                        methods["on" + field.methodName] = func;
                                        componentOrPage["on" + field.methodName] = func;
                                        RecordUtil_1.RecordPathUtil.pathSetEffect(data, field.name, field.methodName);
                                        if (field.name.length === 1) {
                                            methods[key] = func;
                                            componentOrPage[key] = func;
                                        }
                                        continue;
                                    }
                                    simpleState = Object.create(Object.create({}, {
                                        stateEntry: {
                                            value: field.stateEntry,
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                        control: {
                                            value: stateControl,
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                    }), {
                                        name: {
                                            value: RecordUtil_1.RecordPathUtil.pathToString(field.name),
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                        help: {
                                            value: !!field.stateEntry.validating ? "正在验证" :
                                                field.stateEntry.errorMessage,
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                        validateState: {
                                            value: !!field.stateEntry.validating ? "loading" :
                                                !!field.stateEntry.errorMessage ? "error" :
                                                    !!field.touched ? "success" : "",
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                        errorMessage: {
                                            value: field.stateEntry.errorMessage,
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                        touched: {
                                            value: field.stateEntry.touched,
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                        validating: {
                                            value: field.stateEntry.validating,
                                            enumerable: true,
                                            configurable: true,
                                            writable: true,
                                        },
                                    });
                                    value = !!field.container ? !Array.isArray(field.value) ? {
                                        $simpleState: simpleState,
                                    } : [] : field.value;
                                    RecordUtil_1.RecordPathUtil.pathSetEffect(data, field.name, value);
                                    container = RecordUtil_1.RecordPathUtil.pathGet(data, containerName);
                                    if (!Array.isArray(container)) {
                                        RecordUtil_1.RecordPathUtil.pathSetEffect(data, __spreadArray(__spreadArray([], __read(containerName), false), [key + "$simpleState"], false), simpleState);
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (fields_1_1 && !fields_1_1.done && (_b = fields_1.return)) _b.call(fields_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    if (!!componentOrPage.simpleStateDidUnmount) {
                                        //Object.assign(componentOrPage.data, data);
                                        //reject();
                                    }
                                    componentOrPage.setData(data, resolve);
                                })];
                        case 1: return [2 /*return*/, _c.sent()];
                    }
                });
            });
        }
        ;
        var handleTimer = undefined;
        var handleResolve;
        var handleReject;
        var handlePromise = new Promise(function (resolve, reject) {
            handleResolve = resolve;
            handleReject = reject;
        });
        var handleLast = Date.now();
        var handleFirst = true;
        var updateBatch = function () { return __awaiter(_this, void 0, void 0, function () {
            var handleAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!!handleTimer && Date.now() - handleLast > 500)) return [3 /*break*/, 2];
                        return [4 /*yield*/, handlePromise];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!!handleTimer) {
                            clearTimeout(handleTimer);
                            handleTimer = undefined;
                        }
                        handleAction = function () {
                            handleTimer = undefined;
                            handleLast = Date.now();
                            updateUnit().then(function () {
                                handleResolve();
                                handlePromise = new Promise(function (resolve, reject) {
                                    handleResolve = resolve;
                                    handleReject = reject;
                                });
                            }).catch(function (error) {
                                handleReject(error);
                                handlePromise = new Promise(function (resolve, reject) {
                                    handleResolve = resolve;
                                    handleReject = reject;
                                });
                            });
                        };
                        if (!!handleFirst) {
                            handleFirst = false;
                            handleAction();
                            return [2 /*return*/];
                        }
                        handleTimer = setTimeout(handleAction, 1000 / 30);
                        return [4 /*yield*/, handlePromise];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        stateDict.updateEvent.regist(updateBatch);
        var versionValue = 0;
        var version = function () {
            return versionValue;
        };
        var stateControl = {
            state: state,
            stateInstance: state,
            stateDict: stateDict,
            stateEntry: stateEntry,
            updateUnit: updateUnit,
            update: updateBatch,
            // update: async () => {
            //   await stateDict.updateEvent.trigger();
            // },
            fieldValueSet: function (name, value) { return __awaiter(_this, void 0, void 0, function () {
                var namePath;
                return __generator(this, function (_a) {
                    namePath = RecordUtil_1.RecordPathUtil.pathFromString(name);
                    RecordUtil_1.RecordPathUtil.pathSetEffect(state, namePath, value);
                    stateControl.update();
                    return [2 /*return*/];
                });
            }); },
            fieldAction: function (_a) {
                var name = _a.name, _b = _a.action, action = _b === void 0 ? "set" : _b, value = _a.value, _c = _a.inv, inv = _c === void 0 ? false : _c;
                return __awaiter(_this, void 0, void 0, function () {
                    var namePath, arrayNamePath, array, arrayNamePath, index, array, arrayNamePath, array, index, otherIndex, item, other, arrayNamePath, array, index, otherIndex, item, other;
                    return __generator(this, function (_d) {
                        namePath = RecordUtil_1.RecordPathUtil.pathFromString(name);
                        if (action === "set") {
                            if (inv) {
                                value = !value;
                            }
                            RecordUtil_1.RecordPathUtil.pathSetEffect(state, namePath, inv ? !value : value);
                        }
                        if (action === "add") {
                            arrayNamePath = namePath;
                            array = RecordUtil_1.RecordPathUtil.pathGet(state, arrayNamePath);
                            if (!array) {
                                array = [];
                                RecordUtil_1.RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
                            }
                            array[inv ? "unshift" : "push"](value);
                        }
                        if (action === "remove") {
                            arrayNamePath = namePath.slice(0, namePath.length - 1);
                            index = Number(namePath[namePath.length - 1]);
                            array = RecordUtil_1.RecordPathUtil.pathGet(state, arrayNamePath);
                            if (!array) {
                                array = [];
                                RecordUtil_1.RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
                            }
                            array.splice(index, 1);
                        }
                        if (action === "moveUp") {
                            arrayNamePath = namePath.slice(0, namePath.length - 1);
                            array = RecordUtil_1.RecordPathUtil.pathGet(state, arrayNamePath);
                            if (!array) {
                                array = [];
                                RecordUtil_1.RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
                            }
                            index = Number(namePath[namePath.length - 1]);
                            otherIndex = index - 1;
                            if (otherIndex < 0 || otherIndex > array.length - 1 ||
                                index < 0 || index > array.length - 1) {
                                return [2 /*return*/];
                            }
                            item = array[index];
                            other = array[otherIndex];
                            array[index] = other;
                            array[otherIndex] = item;
                        }
                        if (action === "moveDown") {
                            arrayNamePath = namePath.slice(0, namePath.length - 1);
                            array = RecordUtil_1.RecordPathUtil.pathGet(state, arrayNamePath);
                            if (!array) {
                                array = [];
                                RecordUtil_1.RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
                            }
                            index = Number(namePath[namePath.length - 1]);
                            otherIndex = index + 1;
                            if (otherIndex < 0 || otherIndex > array.length - 1 ||
                                index < 0 || index > array.length - 1) {
                                return [2 /*return*/];
                            }
                            item = array[index];
                            other = array[otherIndex];
                            array[index] = other;
                            array[otherIndex] = item;
                        }
                        stateControl.update();
                        return [2 /*return*/];
                    });
                });
            },
            fields: function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                var paths = names.map(function (a) { return RecordUtil_1.RecordPathUtil.pathFromString(a); });
                var fields = fieldsMap(stateEntry).filter(function (field) {
                    return paths.length < 1 ||
                        paths.some(function (path) {
                            return RecordUtil_1.RecordPathUtil.pathStartMatch(field.name, path) ||
                                RecordUtil_1.RecordPathUtil.pathStartMatch(path, field.name);
                        });
                });
                return fields;
            },
            version: version,
        };
        componentOrPage.simpleStateControl = stateControl;
        return stateControl;
    };
    MpSimpleState.validator = function (stateControl, rules) {
        var _this = this;
        var validCt = new CancellationToken_1.SourceCancellationToken();
        var validator = {
            valid: function () {
                var names = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    names[_i] = arguments[_i];
                }
                return __awaiter(_this, void 0, void 0, function () {
                    var validCtLocal, fields, state, validatorImpl, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                validCt.cancel();
                                validCtLocal = validCt = new CancellationToken_1.SourceCancellationToken();
                                fields = stateControl.fields.apply(stateControl, __spreadArray([], __read(names), false));
                                fields.forEach(function (field) {
                                    field.stateEntry.validating = true;
                                    field.stateEntry.errorMessage = "";
                                    field.stateEntry.touched = true;
                                });
                                stateControl.update();
                                validCtLocal.register(function () {
                                    fields.forEach(function (field) {
                                        field.stateEntry.validating = false;
                                        field.stateEntry.errorMessage = "";
                                    });
                                });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                state = stateControl.stateEntry.data;
                                validatorImpl = new exports.Validator(rules);
                                return [4 /*yield*/, validatorImpl.validate(state)];
                            case 2:
                                _a.sent();
                                validCtLocal.throwIfRequested();
                                validCtLocal.cancel();
                                stateControl.update();
                                return [2 /*return*/, true];
                            case 3:
                                error_1 = _a.sent();
                                if (error_1 instanceof Exception_1.OperationCanceledException) {
                                    throw error_1;
                                }
                                validCtLocal.throwIfRequested();
                                validCtLocal.cancel();
                                if (!!error_1.errors) {
                                    fields.forEach(function (field) {
                                        field.stateEntry.validating = false;
                                        field.stateEntry.errors = error_1.errors.
                                            filter(function (er) {
                                            return RecordUtil_1.RecordPathUtil.pathStartMatch(RecordUtil_1.RecordPathUtil.pathFromString(er.field), field.name);
                                        });
                                    });
                                }
                                stateControl.update();
                                return [2 /*return*/, false];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            },
        };
        return validator;
    };
    MpSimpleState.Page = function (_a) {
        var events = _a.events, options = __rest(_a, ["events"]);
        return Page(__assign({ onLoad: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onLoad) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onShow: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onShow) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onReady: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onReady) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onHide: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onHide) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onUnload: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onUnload) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onTitleClick: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onTitleClick) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onPullDownRefresh: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onPullDownRefresh) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onReachBottom: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onReachBottom) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onShareAppMessage: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onShareAppMessage) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, onundefined: function (e) {
                void e;
            }, events: __assign({ onBack: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onBack) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onKeyboardHeight: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onKeyboardHeight) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onOptionMenuClick: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onOptionMenuClick) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onPopMenuClick: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onPopMenuClick) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onPullIntercept: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onPullIntercept) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onPullDownRefresh: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onPullDownRefresh) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onTitleClick: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onTitleClick) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, beforeTabItemTap: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.beforeTabItemTap) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onResize: function () {
                    var _a, _b, _c;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.onResize) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
                }, onundefined: function (e) {
                    void e;
                } }, events) }, options));
    };
    MpSimpleState.Component = function (_a) {
        var onInit = _a.onInit, deriveDataFromProps = _a.deriveDataFromProps, didMount = _a.didMount, didUpdate = _a.didUpdate, didUnmount = _a.didUnmount, methods = _a.methods, otherOptions = __rest(_a, ["onInit", "deriveDataFromProps", "didMount", "didUpdate", "didUnmount", "methods"]);
        var component2 = (function () {
            try {
                return my.canIUse("component2");
            }
            catch (_a) {
                return true;
            }
        })();
        var options = __assign({ onInit: function () {
                var _a, _b, _c, _d, _e;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_b = (_a = this.props).onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                this.simpleStateComponentInited = true;
                onInit === null || onInit === void 0 ? void 0 : onInit.call.apply(onInit, __spreadArray([this], __read(args), false));
                (_e = (_d = (_c = this.simpleStateControl) === null || _c === void 0 ? void 0 : _c.state) === null || _d === void 0 ? void 0 : _d.onInit) === null || _e === void 0 ? void 0 : _e.call.apply(_e, __spreadArray([_d], __read(args), false));
            }, deriveDataFromProps: function () {
                var _a, _b, _c, _d, _e;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_b = (_a = this.props).onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                deriveDataFromProps === null || deriveDataFromProps === void 0 ? void 0 : deriveDataFromProps.call.apply(deriveDataFromProps, __spreadArray([this], __read(args), false));
                (_e = (_d = (_c = this.simpleStateControl) === null || _c === void 0 ? void 0 : _c.state) === null || _d === void 0 ? void 0 : _d.deriveDataFromProps) === null || _e === void 0 ? void 0 : _e.call.apply(_e, __spreadArray([_d], __read(args), false));
            }, didMount: function () {
                var _a, _b, _c, _d, _e, _f;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_b = (_a = this.props).onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                if (!component2 && !this.simpleStateComponentInited) {
                    this.simpleStateComponentInited = true;
                    onInit === null || onInit === void 0 ? void 0 : onInit.call.apply(onInit, __spreadArray([this], __read(args), false));
                }
                if (!component2) {
                    (_c = options.deriveDataFromProps) === null || _c === void 0 ? void 0 : _c.call(this, this.props);
                }
                didMount === null || didMount === void 0 ? void 0 : didMount.call.apply(didMount, __spreadArray([this], __read(args), false));
                (_f = (_e = (_d = this.simpleStateControl) === null || _d === void 0 ? void 0 : _d.state) === null || _e === void 0 ? void 0 : _e.didMount) === null || _f === void 0 ? void 0 : _f.call.apply(_f, __spreadArray([_e], __read(args), false));
            }, didUpdate: function () {
                var _a, _b, _c, _d, _e, _f;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_b = (_a = this.props).onRef) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                if (!component2) {
                    (_c = options.deriveDataFromProps) === null || _c === void 0 ? void 0 : _c.call(this, this.props);
                }
                didUpdate === null || didUpdate === void 0 ? void 0 : didUpdate.call.apply(didUpdate, __spreadArray([this], __read(args), false));
                (_f = (_e = (_d = this.simpleStateControl) === null || _d === void 0 ? void 0 : _d.state) === null || _e === void 0 ? void 0 : _e.didUpdate) === null || _f === void 0 ? void 0 : _f.call.apply(_f, __spreadArray([_e], __read(args), false));
            }, didUnmount: function () {
                var _a, _b, _c;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.simpleStateDidUnmount = true;
                didUnmount === null || didUnmount === void 0 ? void 0 : didUnmount.call.apply(didUnmount, __spreadArray([this], __read(args), false));
                (_c = (_b = (_a = this.simpleStateControl) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.didUnmount) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([_b], __read(args), false));
            }, methods: __assign({ onundefined: function (e) {
                    void e;
                } }, methods) }, otherOptions);
        return Component(options);
    };
    return MpSimpleState;
}());
exports.MpSimpleState = MpSimpleState;
//应在启动时注入Validator的实例
//https://github.com/yiminghe/async-validator
exports.Validator = Reflect.get(Reflect, "MpSimpleStateValidator");
var setupListImpl = [];
var setupList = Reflect.get(Reflect, "MpSimpleStateValidatorSetupList") ||
    (Reflect.set(Reflect, "MpSimpleStateValidatorSetupList", setupListImpl), setupListImpl);
setupList.push(function (value) {
    exports.Validator = value;
});
function ValidatorSetup(value) {
    var e_3, _a;
    Reflect.set(Reflect, "MpSimpleStateValidator", value);
    try {
        for (var setupList_1 = __values(setupList), setupList_1_1 = setupList_1.next(); !setupList_1_1.done; setupList_1_1 = setupList_1.next()) {
            var setup = setupList_1_1.value;
            setup(value);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (setupList_1_1 && !setupList_1_1.done && (_a = setupList_1.return)) _a.call(setupList_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
exports.ValidatorSetup = ValidatorSetup;
