
export type RecordKey = string | number;

export type RecordLiteral = string | number | boolean | null | undefined;

export type RecordObject = {
  [key: string]: RecordValue;
} | {
  [key: number]: RecordValue;
} | {};

export type RecordValue = RecordObject | RecordLiteral;

export class RecordUtil {

  static deepClone<T extends RecordValue>(
    data: T,
    filter: (p: RecordKey, o: RecordObject) => boolean = () => true,
  ): T {
    if (!data || typeof data !== "object") {
      return data;
    }
    if (Array.isArray(data)) {
      const cloned = data.map(a => RecordUtil.deepClone(a, filter));
      return cloned as unknown as T;
    }
    const cloned = Object.keys(data as object).filter(p => filter(p, data)).
      reduce((pre, cur) => ({
        ...pre,
        [cur]: RecordUtil.deepClone(data[cur], filter),
      }), {} as any);
    return cloned;
  }

}



export type RecordPath = RecordKey[];

export class RecordPathUtil {


  static pathIntTest(n: unknown) {
    return typeof n == 'number' && Number.isSafeInteger(n) ||
      typeof n == 'string' && !!n && Number.isSafeInteger(Number(n));
  }

  static pathSet<T = any>(
    target: T,
    path: RecordPath,
    value: unknown,
  ): T {
    if (path.length < 1) {
      return value as T;
    }
    const key = path[0] as string;
    let targetObject: any =
      !RecordPathUtil.pathIntTest(key) && (!target || Array.isArray(target)) ?
        { ...target, } :
        target ?? [];
    targetObject = (
      Array.isArray(targetObject) ?
        [...targetObject] :
        { ...targetObject, }
    );
    targetObject[key] = RecordPathUtil.pathSet(
      targetObject[key],
      path.slice(1),
      value,
    );
    return targetObject as T;
  }

  static pathSetEffect<T = any>(
    target: T,
    path: RecordPath,
    value: unknown,
  ): T {
    if (path.length < 1) {
      return value as T;
    }
    const key = path[0] as string;
    const targetObject = !RecordPathUtil.pathIntTest(key) &&
      (!target || Array.isArray(target)) ?
      { ...target, } :
      target ?? [];
    targetObject[key] = RecordPathUtil.pathSetEffect(
      targetObject[key],
      path.slice(1),
      value,
    );
    return targetObject as T;
  }

  static pathGet = function (
    target: unknown,
    path: RecordPath,
  ): any {
    const data = path.reduce(
      (pre, cur) => !!pre ? (pre as any)[cur] : undefined,
      target,
    );
    return data;
  }

  static pathStartMatch = function (
    allKeyPath: RecordPath,
    startKeyPath: RecordPath,
  ) {
    return (allKeyPath?.length || 0) >= (startKeyPath?.length || 0) &&
      !!startKeyPath?.every((a, i) => String(a) == String(allKeyPath?.[i]));
  }

  static pathMatch = function (a: RecordPath, b: RecordPath) {
    return (a?.length || 0) == (b?.length || 0) && RecordPathUtil.pathStartMatch(a, b);
  }

  static pathToString = function (path: RecordPath) {
    return path.join(".");
  }

  static pathFromString = function (pathString: string) {
    return String(pathString ?? "").replace(/\[/g, ".").replace(/\]/g, "").split(".").filter(a => !!a);
  }
}

