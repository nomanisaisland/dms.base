"use strict";
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
exports.FormSetup = exports.Form = exports.ReactSimpleState = void 0;
var SimpleReact_1 = require("./SimpleReact");
var SimpleStateEntry_1 = require("../model/SimpleStateEntry");
var ReactUtil_1 = require("./ReactUtil");
var ReactSimpleState = /** @class */ (function () {
    function ReactSimpleState() {
    }
    ReactSimpleState.useStateControl = function (defaultValue) {
        var updateBatch = (0, ReactUtil_1.useUpdate)();
        var _a = __read(SimpleReact_1.React.useState(function () {
            var state = typeof defaultValue === "function" ?
                defaultValue() : defaultValue;
            var stateDict = new SimpleStateEntry_1.SimpleStateDict();
            var stateEntry = SimpleStateEntry_1.SimpleStateEntry.fromCreateSlot(state);
            var stateControl = {
                state: state,
                stateEntry: stateEntry,
                stateDict: stateDict,
                update: function () {
                    stateDict.updateEvent.trigger();
                },
            };
            return stateControl;
        }), 1), control = _a[0];
        SimpleReact_1.React.useEffect(function () {
            return control.stateDict.updateEvent.regist(function () {
                updateBatch();
            });
        }, []);
        return control;
    };
    ReactSimpleState.useFormProps = function (stateControl, options) {
        if (options === void 0) { options = {}; }
        var include = function (nameJoin) {
            if (typeof options.include === "string") {
                return nameJoin === options.include;
            }
            if (Array.isArray(options.include)) {
                return options.include.includes(nameJoin);
            }
            return !!options.include ? options.include(nameJoin) : false;
        };
        var exclude = function (nameJoin) {
            if (typeof options.exclude === "string") {
                return nameJoin === options.exclude;
            }
            if (Array.isArray(options.exclude)) {
                return options.exclude.includes(nameJoin);
            }
            return !!options.exclude ? options.exclude(nameJoin) : false;
        };
        function fieldsMap(stateEntry, name) {
            if (name === void 0) { name = []; }
            var nameJoin = name.join(".");
            if (!!options.include && !include(nameJoin)) {
                return [];
            }
            if (!!options.exclude && exclude(nameJoin)) {
                return [];
            }
            var value = stateEntry.data;
            var field = {
                name: name,
                value: value,
                validating: stateEntry.validating,
                touched: stateEntry.touched,
                errors: stateEntry.errors.map(function (a) { var _a; return (_a = a.message) !== null && _a !== void 0 ? _a : ""; }),
            };
            if (value === undefined ||
                value === null ||
                typeof value !== "object" ||
                Array.isArray(value) && value.every(function (a) { return typeof a !== "object"; }) ||
                (typeof Blob !== "undefined" && value instanceof Blob ||
                    typeof HTMLInputElement !== "undefined" && value instanceof HTMLInputElement &&
                        typeof value === "object" && (!!value.fileHold || !!value.originFileObj))) {
                return [field];
            }
            var childFields = Object.keys(value).flatMap(function (k) { return fieldsMap(stateEntry.child(k), __spreadArray(__spreadArray([], __read(name), false), [k], false)); });
            return __spreadArray([
                field
            ], __read(childFields), false);
        }
        var simpleStateEntry = stateControl.stateEntry;
        var _a = __read(exports.Form.useForm(), 1), formRaw = _a[0];
        var _b = __read(SimpleReact_1.React.useState(function () {
            var form = formRaw;
            var fields = fieldsMap(simpleStateEntry);
            form.setFields(fields);
            return form;
        }), 1), form = _b[0];
        SimpleReact_1.React.useEffect(function () {
            return stateControl.stateDict.updateEvent.regist(function () {
                var fields = fieldsMap(simpleStateEntry);
                form.setFields(fields);
            });
        }, []);
        var props = {
            form: form,
            onFieldsChange: function (_values, fields) {
                var e_1, _a;
                try {
                    for (var fields_1 = __values(fields), fields_1_1 = fields_1.next(); !fields_1_1.done; fields_1_1 = fields_1.next()) {
                        var field = fields_1_1.value;
                        var childStateEntry = field.name.reduce(function (pre, cur) { return pre.child(cur); }, simpleStateEntry);
                        childStateEntry.data = field.value;
                        childStateEntry.validating = field.validating;
                        childStateEntry.touched = field.touched;
                        childStateEntry.errors = field.errors.map(function (message) { return ({ message: message, }); });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (fields_1_1 && !fields_1_1.done && (_a = fields_1.return)) _a.call(fields_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                stateControl.update();
            },
        };
        return props;
    };
    return ReactSimpleState;
}());
exports.ReactSimpleState = ReactSimpleState;
//应在启动时注入Form的实例
exports.Form = Reflect.get(Reflect, "ReactSimpleStateForm");
var setupListImpl = [];
var setupList = Reflect.get(Reflect, "ReactSimpleStateFormSetupList") ||
    (Reflect.set(Reflect, "ReactSimpleStateFormSetupList", setupListImpl), setupListImpl);
setupList.push(function (value) {
    exports.Form = value;
});
function FormSetup(value) {
    var e_2, _a;
    Reflect.set(Reflect, "ReactSimpleStateForm", value);
    try {
        for (var setupList_1 = __values(setupList), setupList_1_1 = setupList_1.next(); !setupList_1_1.done; setupList_1_1 = setupList_1.next()) {
            var setup = setupList_1_1.value;
            setup(value);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (setupList_1_1 && !setupList_1_1.done && (_a = setupList_1.return)) _a.call(setupList_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
exports.FormSetup = FormSetup;
