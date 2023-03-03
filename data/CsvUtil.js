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
exports.CsvUtil = void 0;
var CSV_1 = require("./csvString/CSV");
var CsvUtil = /** @class */ (function () {
    function CsvUtil() {
    }
    // 'id,title,desc\n1,a,b' => [['id','title','desc'],['1','a','b']]
    CsvUtil.arraysFromCsvCode = function (csvCode) {
        var rows = (0, CSV_1.parse)(csvCode);
        return rows;
    };
    // [['id','title','desc'],['1','a','b']] => [{id:'1',title,'a',desc:'b'}]
    CsvUtil.recordsFromArrays = function (rows) {
        var header = rows[0];
        var dataRows = rows.slice(1);
        return dataRows.map(function (row) {
            return header.reduce(function (pre, key, index) {
                var _a;
                return __assign(__assign({}, pre), (_a = {}, _a[key] = row[index], _a));
            }, {});
        });
    };
    // 'id,title,desc\n111,a,b' => [{id:'111',title,'a',desc:'b'}]
    CsvUtil.recordsFromCsvCode = function (csvCode) {
        var arrays = this.arraysFromCsvCode(csvCode);
        var records = this.recordsFromArrays(arrays);
        return records;
    };
    CsvUtil.recordsToCsvCode = function (records, titleRecord) {
        var e_1, _a;
        var _this = this;
        var _b;
        var code = "";
        var hasTitle = !!titleRecord;
        if (!titleRecord) {
            titleRecord = (_b = Object.keys(records[0]).reduce(function (pre, cur) {
                var _a;
                return (__assign(__assign({}, pre), (_a = {}, _a[cur] = cur, _a)));
            }, {})) !== null && _b !== void 0 ? _b : {};
        }
        var keys = Object.keys(titleRecord);
        if (hasTitle) {
            code += keys.map(function (key) {
                var title = titleRecord[key] || key;
                return _this.cellEncode(title);
            }).join(",") + "\n";
        }
        var _loop_1 = function (record) {
            code += keys.map(function (key) {
                var _a;
                return _this.cellEncode(((_a = record[key]) !== null && _a !== void 0 ? _a : "") + "");
            }).join(",") + "\n";
        };
        try {
            for (var records_1 = __values(records), records_1_1 = records_1.next(); !records_1_1.done; records_1_1 = records_1.next()) {
                var record = records_1_1.value;
                _loop_1(record);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (records_1_1 && !records_1_1.done && (_a = records_1.return)) _a.call(records_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return code;
    };
    CsvUtil.cellEncode = function (text) {
        return '"' + text.replace(/"/g, '""') + '"';
    };
    return CsvUtil;
}());
exports.CsvUtil = CsvUtil;
