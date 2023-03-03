import { React } from "./SimpleReact";
import { cancelTokenRefCreate } from "../async/CancellationToken";

export class ReactUtil {

  static names(record: Record<string, boolean>) {
    return Object.keys(record).filter(a => !!record[a]).join(" ");
  }

}

export function useUpdate() {
  const vRef = React.useRef(0);
  let [v, s] = React.useState(vRef.current);
  const disRef = React.useRef(false);
  React.useEffect(() => {
    return () => {
      disRef.current = true;
    };
  }, []);
  return () => {
    if (disRef.current) {
      return;
    }
    vRef.current++;
    s(v = vRef.current);
  };
}

export function useUpdateBatch() {

  const update = useUpdate();

  const handle = React.useRef(undefined);
  const handleLast = React.useRef(Date.now());

  return () => {
    if (!!handle.current) {
      cancelAnimationFrame(handle.current);
    }
    handle.current = requestAnimationFrame(() => {
      handle.current = undefined;
      handleLast.current = Date.now();
      update();
    });
  };

}

/**
 * 
 */
export const useRush = (action, deps = undefined) => {
  const unRef = React.useRef();
  React.useMemo(() => {
    if (!!unRef.current) {
      unRef.current();
    }
    unRef.current = action();
  }, deps);
  React.useEffect(() => {
    return () => {
      if (!!unRef.current) {
        unRef.current();
      }
    };
  }, []);
};


/**
 * 声明取消令牌引用
 */
export function useCancelTokenRef() {
  const [ctRef] = React.useState(cancelTokenRefCreate);
  return ctRef;
}
