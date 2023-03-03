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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStateEntry = exports.SimpleStateDict = exports.SimpleStateKeyComparer = exports.SimpleStateKey = void 0;
var HashMap_1 = require("../value/HashMap");
var PropertyKeyComparer_1 = require("../value/PropertyKeyComparer");
var Slot_1 = require("../value/Slot");
var SyncEvent_1 = require("../async/SyncEvent");
var Comparer_1 = require("../value/Comparer");
var CompareUtil_1 = require("../value/CompareUtil");
var Exception_1 = require("../value/Exception");
var ArrayUtil_1 = require("../value/ArrayUtil");
var SimpleStateKey = /** @class */ (function () {
    function SimpleStateKey(container, propKey) {
        this.container = container;
        this.propKey = propKey;
    }
    SimpleStateKey.from = function (container, propKey) {
        return new SimpleStateKey(container, propKey);
    };
    return SimpleStateKey;
}());
exports.SimpleStateKey = SimpleStateKey;
var SimpleStateKeyComparer = /** @class */ (function () {
    function SimpleStateKeyComparer() {
        this.comparer = new CompareUtil_1.MapComparer({
            container: Comparer_1.DefaultComparer.instance,
            propKey: PropertyKeyComparer_1.PropertyKeyComparer.instance,
        });
    }
    SimpleStateKeyComparer.prototype.compare = function (x, y) {
        if (x.container === null || x.container === undefined) {
            return -1;
        }
        if (y.container === null || y.container === undefined) {
            return 1;
        }
        return this.comparer.compare(x, y);
    };
    SimpleStateKeyComparer.prototype.equals = function (x, y) {
        if (x.container === null || x.container === undefined) {
            return false;
        }
        if (y.container === null || y.container === undefined) {
            return false;
        }
        return this.comparer.equals(x, y);
    };
    SimpleStateKeyComparer.prototype.getHashCode = function (obj) {
        return this.comparer.getHashCode(obj);
    };
    SimpleStateKeyComparer.instance = new SimpleStateKeyComparer();
    return SimpleStateKeyComparer;
}());
exports.SimpleStateKeyComparer = SimpleStateKeyComparer;
var SimpleStateDict = /** @class */ (function () {
    function SimpleStateDict() {
        this.store = new HashMap_1.HashMap(SimpleStateKeyComparer.instance);
        this.updateEvent = new SyncEvent_1.SyncEvent();
    }
    SimpleStateDict.prototype.get = function (key) {
        var entry = this.store.getOrDefault(key);
        return entry;
    };
    SimpleStateDict.prototype.set = function (key, value) {
        return this.store.put(key, value);
    };
    SimpleStateDict.prototype.has = function (key) {
        return this.store.has(key);
    };
    SimpleStateDict.prototype.remove = function (key) {
        return this.store.remove(key);
    };
    SimpleStateDict.prototype.reflect = function (key) {
        var entry = this.get(key);
        if (!entry) {
            var reflEntry = new SimpleStateEntry(this, key);
            this.set(key, reflEntry);
            return reflEntry;
        }
        return entry;
    };
    SimpleStateDict.prototype.flatKeys = function (key) {
        var _this = this;
        var allEntries = HashMap_1.HashMap.from(ArrayUtil_1.ArrayUtil.groupBy(this.store.entries(), function (a) { return a.key.container; }), function (a) { return a.key; }, function (a) { return a.list; });
        var flat = function (entryKey, handled) {
            if (handled.has(entryKey)) {
                return [];
            }
            handled.add(entryKey, true);
            var entryValue = _this.get(entryKey);
            if (!entryValue) {
                return [];
            }
            var childEntries = allEntries.getOrDefault(entryValue.data);
            if (!childEntries) {
                return [entryKey];
            }
            var childEntryKeys = childEntries.flatMap(function (a) { return flat(a.key, handled); });
            return __spreadArray([entryKey], __read(childEntryKeys), false);
        };
        var flatEntriesHandled = new HashMap_1.HashMap(SimpleStateKeyComparer.instance);
        var flatEntries = flat(key, flatEntriesHandled);
        return flatEntries;
    };
    return SimpleStateDict;
}());
exports.SimpleStateDict = SimpleStateDict;
var SimpleStateEntry = /** @class */ (function () {
    function SimpleStateEntry(stateDict, stateKey) {
        this.stateDict = stateDict;
        this.stateKey = stateKey;
        this.errors = [];
        this.validating = false;
        this.touched = false;
        this.adjs = {};
    }
    SimpleStateEntry.fromCreateSlot = function (value, stateDict) {
        if (stateDict === void 0) { stateDict = new SimpleStateDict(); }
        var valueSlot = new Slot_1.Slot(value);
        var stateKey = SimpleStateKey.from(valueSlot, "value");
        var stateEntry = new SimpleStateEntry(stateDict, stateKey);
        return stateEntry;
    };
    SimpleStateEntry.prototype.child = function (key) {
        return this.stateDict.reflect(SimpleStateKey.from(this.data, key));
    };
    SimpleStateEntry.prototype.flatEntries = function () {
        var _this = this;
        var flatKeys = this.stateDict.flatKeys(this.stateKey);
        var flatEntries = flatKeys.map(function (key) { return _this.stateDict.reflect(key); });
        return flatEntries;
    };
    Object.defineProperty(SimpleStateEntry.prototype, "data", {
        get: function () {
            if (!(this.stateKey.container instanceof Object)) {
                return undefined;
            }
            var value = Reflect.get(this.stateKey.container, this.stateKey.propKey);
            return value;
        },
        set: function (value) {
            if (!(this.stateKey.container instanceof Object)) {
                throw new Exception_1.InvalidOperationException();
            }
            Reflect.set(this.stateKey.container, this.stateKey.propKey, value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimpleStateEntry.prototype, "errorMessage", {
        get: function () {
            var _a;
            return (_a = this.errors[0]) === null || _a === void 0 ? void 0 : _a.message;
        },
        set: function (value) {
            this.errors = !value ? [] : [{ message: value, }];
        },
        enumerable: false,
        configurable: true
    });
    return SimpleStateEntry;
}());
exports.SimpleStateEntry = SimpleStateEntry;
