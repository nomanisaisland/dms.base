import { OrderEqualityComparer, OrderComparer, EqualityComparer, DefaultComparer } from './Comparer';

export class ArrayComparer<T = any>
    implements OrderEqualityComparer<T[]> {


    constructor(
        readonly comparer: OrderEqualityComparer<T> =
            DefaultComparer.instance,
    ) {

    }

    static staticCompare<T>(
        x: T[],
        y: T[],
        comparer: OrderComparer<T> =
            DefaultComparer.instance,
    ): number {
        if (x === y) {
            return 0;
        }
        let xIndex = 0;
        let yIndex = 0;
        while (xIndex < x.length && yIndex < y.length) {
            const xValue = x[xIndex];
            const yValue = y[yIndex];
            const elementResult = comparer.compare(xValue, yValue);
            if (elementResult != 0) {
                return elementResult;
            }
            xIndex++;
            yIndex++;
        }
        if (xIndex < x.length) {
            return 1;
        }
        if (yIndex < y.length) {
            return -1;
        }
        return 0;
    }

    static staticEquals<T>(
        x: T[],
        y: T[],
        comparer: EqualityComparer<T> = DefaultComparer.instance
    ): boolean {
        if (x === y) {
            return true;
        }
        let xIndex = 0;
        let yIndex = 0;
        while (xIndex < x.length && yIndex < y.length) {
            const xValue = x[xIndex];
            const yValue = y[yIndex];
            const elementResult = comparer.equals(xValue, yValue);
            if (!elementResult) {
                return elementResult;
            }
            xIndex++;
            yIndex++;
        }
        if (xIndex < x.length) {
            return false;
        }
        if (yIndex < y.length) {
            return false;
        }
        return true;
    }

    static staticGetHashCode<T>(
        obj: T[],
        comparer: EqualityComparer<T> = DefaultComparer.instance,
    ): number {
        const sum = obj.map(a => comparer.getHashCode(a)).
            reduce((pre, cur) => pre + cur, 0);
        return sum;
    }

    compare(x: T[], y: T[]): number {
        return ArrayComparer.staticCompare(x, y, this.comparer);
    }

    equals(x: T[], y: T[]): boolean {
        return ArrayComparer.staticEquals(x, y, this.comparer);
    }

    getHashCode(obj: T[]): number {
        return ArrayComparer.staticGetHashCode(obj, this.comparer);
    }

    static instance = new ArrayComparer();
}