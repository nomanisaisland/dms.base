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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TbSkuUtil = void 0;
var TbSkuUtil = /** @class */ (function () {
    function TbSkuUtil() {
    }
    TbSkuUtil.propsMapFromPropsName = function (propsName, rename) {
        if (rename === void 0) { rename = {}; }
        var idNameGroups = this.pvnList(propsName);
        var renameFrom = Object.entries(rename).reduce(function (pre, cur) {
            var _a;
            return __assign(__assign({}, pre), (_a = {}, _a[cur[1]] = cur[0], _a));
        }, {});
        var propsMap = idNameGroups.reduce(function (pre, cur) {
            var _a, _b, _c;
            return __assign(__assign(__assign(__assign({}, pre), (_a = {}, _a[cur.pidName] = cur.vidName, _a[cur.pid] = cur.vid, _a)), !!renameFrom[cur.pidName] ? (_b = {},
                _b[renameFrom[cur.pidName]] = cur.vidName,
                _b) : {}), !!renameFrom[cur.pid] ? (_c = {},
                _c[renameFrom[cur.pid]] = cur.vid,
                _c) : {});
        }, {});
        return propsMap;
    };
    TbSkuUtil.propsMapFromPropsNameAlias = function (propsName, rename, alias, aliasRename) {
        if (rename === void 0) { rename = {}; }
        var skuAliasList = alias.split(";").map(function (skuAlias) { return skuAlias.split(":"); }).map(function (skuAlias) { return ({
            pid: skuAlias[0],
            vid: skuAlias[1],
            aliasName: skuAlias[2],
        }); });
        var propsMap = this.propsMapFromPropsName(propsName, rename);
        var propsRename = Object.entries(aliasRename).reduce(function (pre, cur) {
            var _a;
            var pidKey = cur[1];
            var vid = propsMap[pidKey];
            var pid = Object.keys(propsMap).find(function (k) { return propsMap[k] === vid && k !== pidKey; });
            var skuAlias = skuAliasList.find(function (skuAlias) { return skuAlias.pid === pid && skuAlias.vid === vid; });
            return __assign(__assign({}, pre), (_a = {}, _a[cur[0]] = skuAlias === null || skuAlias === void 0 ? void 0 : skuAlias.aliasName, _a));
        }, {});
        var propsMapAlias = __assign(__assign({}, propsMap), propsRename);
        return propsMapAlias;
    };
    TbSkuUtil.pvList = function (props) {
        return props.split(";").
            filter(function (skuProp) { return !!skuProp; }).
            map(function (skuProp) { return skuProp.split(":"); }).
            map(function (skuProp) { return ({ pid: skuProp[0], vid: skuProp[1], }); }).
            filter(function (skuProp) { return !!skuProp.pid; });
    };
    TbSkuUtil.pvnList = function (propsName) {
        return propsName.split(";").
            filter(function (skuProp) { return !!skuProp; }).
            map(function (skuProp) { return skuProp.split(":"); }).
            map(function (skuProp) { return ({
            pid: skuProp[0],
            vid: skuProp[1],
            pidName: skuProp[2],
            vidName: skuProp[3],
        }); });
    };
    TbSkuUtil.pvnaList = function (propsName, alias) {
        var pvnList = this.pvnList(propsName);
        var pvaList = alias.split(";").map(function (skuAlias) { return skuAlias.split(":"); }).map(function (skuAlias) { return ({
            pid: skuAlias[0],
            vid: skuAlias[1],
            aliasName: skuAlias[2],
        }); });
        return pvnList.map(function (pvn) {
            var pvna = pvaList.find(function (pvna) { return pvna.pid === pvn.pid && pvna.vid === pvn.vid; });
            return __assign(__assign({}, pvn), pvna);
        });
    };
    return TbSkuUtil;
}());
exports.TbSkuUtil = TbSkuUtil;
