import { OrderEqualityComparer } from './Comparer';

export default class StringComparer
    implements OrderEqualityComparer<string> {

    private constructor(
        private readonly ignoreCase = false,
    ) {

    }

    equals(x: string, y: string): boolean {
        if (this.ignoreCase) {
            x = x?.toUpperCase();
            y = y?.toUpperCase();
        }
        return x === y;
    }
    getHashCode(obj: string): number {
        if (this.ignoreCase) {
            obj = obj?.toUpperCase();
        }
        if (!obj) {
            obj = "";
        }
        let hash = 0;
        for (let i = 0; i < obj.length; i++) {
            hash = (((hash << 5) - hash) + obj.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
    }
    compare(x: string, y: string): number {
        if (this.ignoreCase) {
            x = x?.toUpperCase();
            y = y?.toUpperCase();
        }
        return x === y ? 0 : x > y ? 1 : -1;
    }

    static ordinal = new StringComparer();

    static ordinalIgnoreCase = new StringComparer(true);
}
