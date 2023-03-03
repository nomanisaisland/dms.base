
export interface OrderComparer<T = unknown> {

    // x > y ? -1 : x < y ? 1 : 0
    compare(x: T, y: T): number;
}


export interface EqualityComparer<T = unknown> {
    equals(x: T, y: T): boolean;
    getHashCode(obj: T): number;
}

export interface OrderEqualityComparer<T = unknown>
    extends OrderComparer<T>, EqualityComparer<T> {

}

export class DefaultComparer<T>
    implements OrderEqualityComparer<T> {

    equals(x: T, y: T): boolean {
        if (x === y) {
            return true;
        }
        if (Number.isNaN(x) && Number.isNaN(y)) {
            return true;
        }
        return false;
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