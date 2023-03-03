import { DefaultComparer, OrderEqualityComparer } from "../value/Comparer";
import { HashMap } from "../value/HashMap";

export type SimpleIocType<T = unknown> = {
    prototype: T;
};

export type SimpleIocCtor<T = unknown> = {
    new(): T;
    prototype: T;
};

class SimpleIocComapler implements OrderEqualityComparer<any> {

    compare(x: any, y: any): number {
        if (!!x?.SimpleIocKey) {
            x = x.SimpleIocKey;
        }
        if (!!y?.SimpleIocKey) {
            y = y.SimpleIocKey;
        }
        return DefaultComparer.instance.compare(x, y);
    }
    equals(x: any, y: any): boolean {
        if (!!x?.SimpleIocKey) {
            x = x.SimpleIocKey;
        }
        if (!!y?.SimpleIocKey) {
            y = y.SimpleIocKey;
        }
        return DefaultComparer.instance.equals(x, y);
    }
    getHashCode(obj: any): number {
        if (!!obj?.SimpleIocKey) {
            obj = obj.SimpleIocKey;
        }
        return DefaultComparer.instance.getHashCode(obj);
    }
}

class SimpleIocImpl {

    static singleMap = new HashMap(new SimpleIocComapler());

    static factorySingle = function (key: unknown, factory: () => unknown) {
        const map = this.singleMap;
        if (!map.getOrDefault(key)) {
            map.put(key, factory());
        }
        const value = map.get(key);
        return value;
    }

    static resolveMap = new HashMap<unknown, () => unknown>(new SimpleIocComapler());

    static resolve<T>(type: SimpleIocType<T>): T {
        const map = this.resolveMap;
        const key = type;
        if (!map.has(key)) {
            const ctor = type as SimpleIocCtor<T>;
            map.put(key, () => this.factorySingle(key, () => new ctor()));
        }
        const factory = map.get(key);
        return factory() as T;
    }

    static resolveArrayMap = new HashMap<unknown, () => unknown[]>();

    static resolveArray<T>(type: SimpleIocType<T>): T[] {
        const key = type;
        const map = this.resolveArrayMap;
        if (!map.has(key)) {
            map.put(key, () => []);
        }
        const factory = map.get(key);
        return factory() as T[];
    }

    static regist = function (key: unknown, impl: SimpleIocCtor) {
        const map = this.resolveMap;
        map.put(key, () => this.factorySingle(key, () => new impl()));
    }

    static registArray = function (key: unknown, impl: SimpleIocCtor) {
        const map = this.resolveArrayMap;
        if (!map.has(key)) {
            map.put(key, () => []);
        }
        const pre = map.get(key)();
        map.put(key, () => [this.resolve(impl), ...pre]);
    }

}

export type SimpleIoc = SimpleIocImpl;
export const SimpleIoc =
    Reflect.get(Reflect, "SimpleIoc") as typeof SimpleIocImpl ||
    (Reflect.set(Reflect, "SimpleIoc", SimpleIocImpl), SimpleIocImpl);