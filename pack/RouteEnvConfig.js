"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteEnvConfig = void 0;
var RouteEnvConfigValue = Reflect.get(Reflect, "RouteEnvConfig");
if (!RouteEnvConfigValue) {
    RouteEnvConfigValue = {
        RouteEnvConfig: "RouteEnvConfig",
    };
    Reflect.set(Reflect, "RouteEnvConfig", RouteEnvConfigValue);
}
/**
 * 运行时公共全局键值对配置
 */
exports.RouteEnvConfig = RouteEnvConfigValue;
