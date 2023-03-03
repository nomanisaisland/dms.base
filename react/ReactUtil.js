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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCancelTokenRef = exports.useRush = exports.useUpdateBatch = exports.useUpdate = exports.ReactUtil = void 0;
var SimpleReact_1 = require("./SimpleReact");
var CancellationToken_1 = require("../async/CancellationToken");
var ReactUtil = /** @class */ (function () {
    function ReactUtil() {
    }
    ReactUtil.names = function (record) {
        return Object.keys(record).filter(function (a) { return !!record[a]; }).join(" ");
    };
    return ReactUtil;
}());
exports.ReactUtil = ReactUtil;
function useUpdate() {
    var vRef = SimpleReact_1.React.useRef(0);
    var _a = __read(SimpleReact_1.React.useState(vRef.current), 2), v = _a[0], s = _a[1];
    var disRef = SimpleReact_1.React.useRef(false);
    SimpleReact_1.React.useEffect(function () {
        return function () {
            disRef.current = true;
        };
    }, []);
    return function () {
        if (disRef.current) {
            return;
        }
        vRef.current++;
        s(v = vRef.current);
    };
}
exports.useUpdate = useUpdate;
function useUpdateBatch() {
    var update = useUpdate();
    var handle = SimpleReact_1.React.useRef(undefined);
    var handleLast = SimpleReact_1.React.useRef(Date.now());
    return function () {
        if (!!handle.current) {
            cancelAnimationFrame(handle.current);
        }
        handle.current = requestAnimationFrame(function () {
            handle.current = undefined;
            handleLast.current = Date.now();
            update();
        });
    };
}
exports.useUpdateBatch = useUpdateBatch;
/**
 *
 */
var useRush = function (action, deps) {
    if (deps === void 0) { deps = undefined; }
    var unRef = SimpleReact_1.React.useRef();
    SimpleReact_1.React.useMemo(function () {
        if (!!unRef.current) {
            unRef.current();
        }
        unRef.current = action();
    }, deps);
    SimpleReact_1.React.useEffect(function () {
        return function () {
            if (!!unRef.current) {
                unRef.current();
            }
        };
    }, []);
};
exports.useRush = useRush;
/**
 * 声明取消令牌引用
 */
function useCancelTokenRef() {
    var _a = __read(SimpleReact_1.React.useState(CancellationToken_1.cancelTokenRefCreate), 1), ctRef = _a[0];
    return ctRef;
}
exports.useCancelTokenRef = useCancelTokenRef;
