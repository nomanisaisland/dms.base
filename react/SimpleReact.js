"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactSetup = exports.React = void 0;
//应在启动时注入React的实例
exports.React = undefined;
function ReactSetup(value) {
    exports.React = value;
}
exports.ReactSetup = ReactSetup;
