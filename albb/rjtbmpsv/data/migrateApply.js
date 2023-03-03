"use strict";
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
exports.migrateApply = void 0;
/**
 * 应用数据迁移
 */
var migrateApply = function (context) { return __awaiter(void 0, void 0, void 0, function () {
    var cloud, error_1, remoteList, migrateList, _loop_1, migrateList_1, migrateList_1_1, local, e_1_1;
    var e_1, _a;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!!migrateApplyEd) {
                    return [2 /*return*/];
                }
                migrateApplyEd = true;
                cloud = context.cloud;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cloud.db.createCollection("migrate")];
            case 2:
                _e.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _e.sent();
                console.error(error_1);
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, cloud.db.collection("migrate").find({}, { sort: { key: 1, } })];
            case 5:
                remoteList = _e.sent();
                migrateList = require('./migrateConfig').migrateConfig.list;
                _loop_1 = function (local) {
                    var remote, error_2, errorMessage, errorStack, error_3, error_4;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                remote = remoteList.find(function (a) { return a.key == local.key; });
                                if (!!remote) {
                                    return [2 /*return*/, "continue"];
                                }
                                _f.label = 1;
                            case 1:
                                _f.trys.push([1, 4, , 13]);
                                return [4 /*yield*/, local.action(context)];
                            case 2:
                                _f.sent();
                                return [4 /*yield*/, cloud.db.collection("migrate").insertOne({
                                        key: local.key,
                                        time: Date.now(),
                                    })];
                            case 3:
                                _f.sent();
                                return [3 /*break*/, 13];
                            case 4:
                                error_2 = _f.sent();
                                console.error(error_2);
                                errorMessage = String((_c = (_b = error_2 === null || error_2 === void 0 ? void 0 : error_2.errorMessage) !== null && _b !== void 0 ? _b : error_2 === null || error_2 === void 0 ? void 0 : error_2.message) !== null && _c !== void 0 ? _c : error_2);
                                errorStack = String((_d = error_2 === null || error_2 === void 0 ? void 0 : error_2.errorStack) !== null && _d !== void 0 ? _d : error_2 === null || error_2 === void 0 ? void 0 : error_2.stack);
                                _f.label = 5;
                            case 5:
                                _f.trys.push([5, 11, , 12]);
                                _f.label = 6;
                            case 6:
                                _f.trys.push([6, 8, , 9]);
                                return [4 /*yield*/, cloud.db.createCollection("migrateLog")];
                            case 7:
                                _f.sent();
                                return [3 /*break*/, 9];
                            case 8:
                                error_3 = _f.sent();
                                console.error(error_3);
                                return [3 /*break*/, 9];
                            case 9: return [4 /*yield*/, cloud.db.collection("migrateLog").insertOne({
                                    key: local.key,
                                    time: Date.now(),
                                    errorMessage: errorMessage,
                                    errorStack: errorStack,
                                })];
                            case 10:
                                _f.sent();
                                return [3 /*break*/, 12];
                            case 11:
                                error_4 = _f.sent();
                                console.error(error_4);
                                return [3 /*break*/, 12];
                            case 12: throw error_2;
                            case 13: return [2 /*return*/];
                        }
                    });
                };
                _e.label = 6;
            case 6:
                _e.trys.push([6, 11, 12, 13]);
                migrateList_1 = __values(migrateList), migrateList_1_1 = migrateList_1.next();
                _e.label = 7;
            case 7:
                if (!!migrateList_1_1.done) return [3 /*break*/, 10];
                local = migrateList_1_1.value;
                return [5 /*yield**/, _loop_1(local)];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9:
                migrateList_1_1 = migrateList_1.next();
                return [3 /*break*/, 7];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 13];
            case 12:
                try {
                    if (migrateList_1_1 && !migrateList_1_1.done && (_a = migrateList_1.return)) _a.call(migrateList_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.migrateApply = migrateApply;
var migrateApplyEd = false;
