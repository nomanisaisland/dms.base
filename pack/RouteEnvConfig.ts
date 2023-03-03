
let RouteEnvConfigValue = Reflect.get(Reflect, "RouteEnvConfig");
if (!RouteEnvConfigValue) {
  RouteEnvConfigValue = {
    RouteEnvConfig: "RouteEnvConfig",
  };
  Reflect.set(Reflect, "RouteEnvConfig", RouteEnvConfigValue);
}

/**
 * 运行时公共全局键值对配置
 */
export const RouteEnvConfig: Record<string, any> = RouteEnvConfigValue;
