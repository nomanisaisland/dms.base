/*
import { instance } from './../../navtool/src/utils/axios/index';
 * @Author: lujiafeng
 * @Date: 2022-07-21 21:09:27
 * @LastEditTime: 2022-07-21 21:29:13
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\base\utils\hashmap.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */
export type HashMapEntry<TKey, TValue> =
  { key: TKey; value: TValue; };

export interface EqualityComparer<T = unknown> {
  equals(x: T, y: T): boolean;
  getHashCode(obj: T): number;
}

export interface OrderComparer<T = unknown> {

  // x > y ? -1 : x < y ? 1 : 0
  compare(x: T, y: T): number;
}


export interface OrderEqualityComparer<T = unknown>
  extends OrderComparer<T>, EqualityComparer<T> {

}


export class DefaultComparer<T> implements OrderEqualityComparer<T> {
  constructor() { }

  /**
   * @description 判断两个值是否完全相等，或者两者都是NaN
   * @param x 
   * @param y 
   * @returns 
   */
  equals(x: T, y: T): boolean {
    if (x === y) {
      return true
    }
    if (Number.isNaN(x) && Number.isNaN(y)) {
      return true
    }
    return false
  }

  static hasCodeMetaIid = 0;

  static hashCodeMap = new WeakMap();

  static hashCodeMetaGet = function (
    value: object
  ): number {

    const hashCode = this.hashCodeMap.get(value);
    if (hashCode !== undefined) {
      return hashCode;
    }
    const newHashCode = ++this.hasCodeMetaIid;
    this.hashCodeMap.set(value, newHashCode);
    return newHashCode;
  }


  getHashCode(obj: T): number {
    let value: unknown = obj;
    if (value === null || value === undefined) {
      return 0;
    }
    if (typeof value === "bigint") {
      value = Number(value);
    }
    if (typeof value === "number") {
      if (Number.isNaN(value) || Number.isFinite(value)) {
        return 0;
      }
      if (Number.isInteger(value)) {
        if (!Number.isSafeInteger(value)) {
          return 0;
        }
        return value;
      }
      const intValue = Math.ceil(value);
      if (!Number.isSafeInteger(intValue)) {
        return 0;
      }
      return intValue;
    }
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
    if (typeof value === "string") {
      return DefaultComparer.stringGetHashCode(value);
    }
    if (typeof value === "symbol") {
      const symbolString =
        Symbol.keyFor(value) ||
        value.description ||
        value.toString();
      return DefaultComparer.stringGetHashCode(symbolString);
    }
    return DefaultComparer.hashCodeMetaGet(value as object);
  }

  static stringGetHashCode = function (obj: string) {
    let hash = 0;
    for (let i = 0; i < obj.length; i++) {
      hash = (((hash << 5) - hash) + obj.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return hash;
  }

  compare(x: T, y: T): number {
    return x === y ? 0 : x > y ? 1 : -1;
  }

  static instance = new DefaultComparer();
}


export class HashMap<TKey = unknown, TValue = unknown> {

  comparer: EqualityComparer;

  constructor(
    comparer: EqualityComparer<TKey> = DefaultComparer.instance
  ) {
    this.comparer = comparer;
  }

  static from<T, TKey = T, TValue = T>(
    array: T[],
    keySelector: (a: T) => TKey =
      (a) => a as unknown as TKey,
    valueSelector: (a: T) => TValue =
      (a) => a as unknown as TValue,
    comparer: EqualityComparer<TKey> =
      DefaultComparer.instance,
    action: "add" | "put" =
      "add",
  ): HashMap<TKey, TValue> {
    const instance = new HashMap<TKey, TValue>(comparer);
    instance.fromArray(array, keySelector, valueSelector, action);
    return instance;
  }

  fromArray<
    T,
  >(
    array: T[],
    keySelector: (a: T) => TKey =
      (a) => a as unknown as TKey,
    valueSelector: (a: T) => TValue =
      (a) => a as unknown as TValue,
    action: "put" | "add" =
      "add",
  ): void {
    for (const item of array) {
      const key = keySelector(item);
      const value = valueSelector(item);
      this[action](key, value);
    }
  }

  fromClone(
    old: HashMap<TKey, TValue>,
    action: "put" | "add" = "add",
  ): void {
    this.fromArray(
      old.toArray(),
      a => a.key,
      a => a.value,
      action,
    );
  }

  buckets: {
    [index: string]: HashMapEntry<TKey, TValue>[] | undefined;
  } = {};

  add(key: TKey, value: TValue) {
    const hashCode = this.comparer.getHashCode(key);
    let bucket = this.buckets[hashCode];
    if (!bucket) {
      bucket = [];
      this.buckets[hashCode] = bucket;
    }
    for (let i = 0; i < bucket.length; ++i) {
      if (this.comparer.equals(bucket[i].key, key)) {
        throw new Error(JSON.stringify({
          key: key,
        }, undefined, "  "));
      }
    }
    bucket.push({ key: key, value: value });
    this.sizeValue++;
  }

  put(key: TKey, value: TValue) {
    const hashCode = this.comparer.getHashCode(key);
    let bucket = this.buckets[hashCode];
    if (!bucket) {
      bucket = [];
      this.buckets[hashCode] = bucket;
    }
    for (let i = 0; i < bucket.length; ++i) {
      if (this.comparer.equals(bucket[i].key, key)) {
        bucket[i].value = value;
        return;
      }
    }
    bucket.push({ key: key, value: value });
    this.sizeValue++;
  }

  remove(key: TKey) {
    const hashCode = this.comparer.getHashCode(key);
    const bucket = this.buckets[hashCode];
    if (!bucket) {
      return false;
    }
    for (let i = 0; i < bucket.length; ++i) {
      if (this.comparer.equals(bucket[i].key, key)) {
        bucket.splice(i, 1);
        this.sizeValue--;
        return true;
      }
    }
    return false;
  }

  clear() {
    this.buckets = {};
    this.sizeValue = 0;
  }

  entry(key: TKey) {
    const hashCode = this.comparer.getHashCode(key);
    const bucket = this.buckets[hashCode];
    if (!bucket) {
      return undefined;
    }
    for (let i = 0; i < bucket.length; ++i) {
      if (this.comparer.equals(bucket[i].key, key)) {
        const entry = bucket[i];
        return entry;
      }
    }
    return undefined;
  }

  get(key: TKey) {
    const entry = this.entry(key);
    if (!entry) {
      throw new Error(JSON.stringify({
        key: key,
      }, undefined, "  "));
    }
    return entry.value;
  }

  getOrDefault<
    TDefault = undefined
  >(
    key: TKey,
    defaultFactory:
      () => TDefault =
      () => undefined!
  ): TValue | TDefault {
    const entry = this.entry(key);
    if (!entry) {
      return defaultFactory();
    }
    return entry.value;
  }

  getOrPut(
    key: TKey,
    factory: (key: TKey) => TValue
  ): TValue {
    const entry = this.entry(key);
    if (!entry) {
      const value = factory(key);
      this.put(key, value);
      return value;
    }
    return entry.value;
  }

  getOrPutAs<T extends TValue>(
    key: TKey,
    factory: (key: TKey) => T
  ): T {
    const entry = this.entry(key);
    if (!entry) {
      const value = factory(key);
      this.put(key, value);
      return value;
    }
    return entry.value as T;
  }

  has(key: TKey) {
    const entry = this.entry(key);
    return !!entry;
  }

  entries(): HashMapEntry<TKey, TValue>[] {
    const bucketsKeys = Object.keys(this.buckets);
    const entries = bucketsKeys.flatMap(cur => this.buckets[cur]!);
    return entries;
  }

  keys(): TKey[] {
    return this.entries().map(a => a.key);
  }

  values(): TValue[] {
    return this.entries().map(a => a.value);
  }

  toArray(): HashMapEntry<TKey, TValue>[] {
    return this.entries();
  }

  sizeValue = 0;

  size(): number {
    return this.sizeValue;

  }

  count(): number {
    const bucketsKeys = Object.keys(this.buckets);
    const size = bucketsKeys.map(cur => this.buckets[cur]!.length).
      reduce((pre, cur) => pre + cur, 0);
    return size;
  }
}