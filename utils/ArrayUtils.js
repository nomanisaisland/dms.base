"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtils = void 0;
var ArrayUtils = /** @class */ (function () {
    function ArrayUtils() {
    }
    /**
     * @param list 数组
     * @param type 需要分组的字段
     * @returns 分好组的对象
     */
    ArrayUtils.groupBy = function (list, type) {
        var groupList = {};
        list.forEach(function (item) {
            var itemType = item[type];
            if (Reflect.ownKeys(groupList).indexOf(String(itemType))) {
                groupList[itemType] = [item];
            }
            else {
                groupList[itemType].push(item);
            }
        });
        return groupList;
    };
    return ArrayUtils;
}());
exports.ArrayUtils = ArrayUtils;
