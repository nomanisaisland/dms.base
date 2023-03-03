import { EqualityComparer, DefaultComparer } from "./Comparer";

export type HashMapEntry<TKey, TValue> =
    { key: TKey; value: TValue; };

export class HashMap<TKey = unknown, TValue = unknown> {

    comparer: EqualityComparer;

    constructor(
        comparer: EqualityComparer<TKey> = DefaultComparer.instance,
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