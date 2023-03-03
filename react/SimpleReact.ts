
export type ReactNs = {
  useState: <T>(
    v: T | (() => T),
  ) => [T, (v: T) => void];
  [k: string]: any;
};

//应在启动时注入React的实例
export let React = undefined as ReactNs;

export function ReactSetup(value: ReactNs) {
  React = value;
}
