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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudDbClient = void 0;
var TbmpcloudClient_1 = require("./TbmpcloudClient");
exports.cloudDbClient = {
    collection: function (tableName) {
        return {
            insertOne: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('insertOne', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            insertMany: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('insertMany', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            deleteMany: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('deleteMany', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            find: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('find', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            replaceOne: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('replaceOne', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            updateMany: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('updateMany', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            count: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('count', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            aggregate: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('aggregate', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
            createIndex: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('createIndex', tableName, args)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                });
            },
        };
    },
    createCollection: function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cloudDbCloudfuncInvoke('createCollection', tableName, [])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
function cloudDbCloudfuncInvoke(methodName, tableName, args) {
    return __awaiter(this, void 0, void 0, function () {
        var uploadResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TbmpcloudClient_1.cloud.function.invoke('cloudfuncs', {
                        methodName: methodName,
                        tableName: tableName,
                        args: args,
                    }, 'cloudDbInvoke')];
                case 1:
                    uploadResult = _a.sent();
                    if (!!uploadResult.error) {
                        throw uploadResult.error;
                    }
                    return [2 /*return*/, uploadResult.data];
            }
        });
    });
}
