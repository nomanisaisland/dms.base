"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readChunk = exports.readAll = exports.forEach = exports.read = exports.parse = exports.stringify = exports.detect = exports.separator = exports.eol = void 0;
var Parser_1 = require("./Parser");
var EOL = '\r\n';
exports.eol = EOL;
var SEPARATOR = ',';
exports.separator = SEPARATOR;
var quoteCharReqex = new RegExp('"', 'g');
var specialCharReqex = new RegExp('["\r\n]', 'g');
var _shouldBeQuoted = function (value, sep) {
    return value.search(specialCharReqex) >= 0 || value.includes(sep);
};
var _quoteIfRquired = function (value, sep) {
    return _shouldBeQuoted(value, sep)
        ? '"' + value.replace(quoteCharReqex, '""') + '"'
        : value;
};
var _stringifySingleValue = function (item) {
    if (item === 0) {
        item = '0';
    }
    else if (item === undefined || item === null) {
        item = '';
    }
    if (typeof item != 'string') {
        var s = item.toString();
        if (s == '[object Object]') {
            item = JSON.stringify(item);
            if (item == '{}') {
                item = '';
            }
        }
        else {
            item = s;
        }
    }
    return item;
};
var reducer = function (item, memo, sep, prependSep) {
    item = _stringifySingleValue(item);
    return ((memo !== undefined || prependSep ? "".concat(memo).concat(sep) : '') +
        _quoteIfRquired(item, sep));
};
var detect = function (input) {
    var separators = [',', ';', '|', '\t'];
    var idx = separators
        .map(function (separator) { return input.indexOf(separator); })
        .reduce(function (prev, cur) {
        return prev === -1 || (cur !== -1 && cur < prev) ? cur : prev;
    });
    return (input[idx] || ',');
};
exports.detect = detect;
var stringify = function (input, sep) {
    if (sep === void 0) { sep = SEPARATOR; }
    var ret;
    sep = sep || SEPARATOR;
    if (Array.isArray(input)) {
        if (input.length === 0) {
            ret = EOL;
        }
        else if (!Array.isArray(input[0])) {
            for (var loop = 0; loop < input.length; loop++) {
                ret = reducer(input[loop], ret, sep, loop > 0);
            }
            ret += EOL;
        }
        else if (Array.isArray(input[0])) {
            ret = input.map(function (item) { return stringify(item, sep); }).join('');
        }
    }
    else if (typeof input == 'object') {
        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                ret = reducer(input[key], ret, sep);
            }
        }
        ret += EOL;
    }
    else {
        ret = reducer(input, ret, sep) + EOL;
    }
    return ret;
};
exports.stringify = stringify;
var parse = function (input, sep, quo) {
    if (sep === undefined) {
        // try to detect the separator if not provided
        sep = detect(input);
    }
    var csv = new Parser_1.Parser(input, sep, quo);
    return csv.File();
};
exports.parse = parse;
function read(input, sep, quo, callback) {
    if (callback === undefined) {
        if (quo === undefined) {
            // arguments.length < 3) {
            if (typeof sep !== 'function') {
                throw Error('Last/second argument is not a callback');
            }
            callback = sep;
            sep = ',';
        }
        else {
            // arguments.length < 4) {
            if (typeof quo !== 'function') {
                throw Error('Last/third argument is not a callback');
            }
            callback = quo;
            quo = '"';
        }
    }
    var csv = new Parser_1.Parser(input, sep, quo);
    var fields = csv.Row();
    callback(fields);
    return csv.pointer;
}
exports.read = read;
function forEach(input, sep, quo, callback) {
    if (callback === undefined) {
        if (quo === undefined) {
            // arguments.length < 3) {
            if (typeof sep !== 'function') {
                throw Error('Last/second argument is not a callback');
            }
            callback = sep;
            sep = ',';
        }
        else {
            // arguments.length < 4) {
            if (typeof quo !== 'function') {
                throw Error('Last/third argument is not a callback');
            }
            callback = quo;
            quo = '"';
        }
    }
    var i = 0;
    var s = 0;
    var r;
    while ((r = read(input.slice(s), sep, quo, function (fields) {
        return callback(fields, i++);
    }))) {
        s += r;
    }
}
exports.forEach = forEach;
function readAll(input, sep, quo, callback) {
    if (callback === undefined) {
        if (quo === undefined) {
            // arguments.length < 3) {
            if (typeof sep !== 'function') {
                throw Error('Last/second argument is not a callback');
            }
            callback = sep;
            sep = ',';
        }
        else {
            // arguments.length < 4) {
            if (typeof quo !== 'function') {
                throw Error('Last/third argument is not a callback');
            }
            callback = quo;
            quo = '"';
        }
    }
    var csv = new Parser_1.Parser(input, sep, quo);
    var rows = csv.File();
    callback(rows);
    return csv.pointer;
}
exports.readAll = readAll;
function readChunk(input, sep, quo, callback) {
    if (callback === undefined) {
        if (quo === undefined) {
            // arguments.length < 3) {
            if (typeof sep !== 'function') {
                throw Error('Last/second argument is not a callback');
            }
            callback = sep;
            sep = ',';
        }
        else {
            // arguments.length < 4) {
            if (typeof quo !== 'function') {
                throw Error('Last/third argument is not a callback');
            }
            callback = quo;
            quo = '"';
        }
    }
    var csv = new Parser_1.Parser(input, sep, quo);
    var rows = csv.File();
    var ret = 0;
    if (csv.pointer < input.length) {
        ret = csv.pointer;
    }
    else {
        rows.pop();
        ret = csv.linePointer;
    }
    callback(rows);
    return ret;
}
exports.readChunk = readChunk;
