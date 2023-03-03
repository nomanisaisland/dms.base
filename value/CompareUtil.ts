import { OrderEqualityComparer, DefaultComparer } from './Comparer';

export class SelectComparer<T = unknown, TMaped = unknown>
    implements OrderEqualityComparer<T> {

    constructor(
        readonly selector: (a: T) => TMaped,
        readonly comparer: OrderEqualityComparer<TMaped> =
            DefaultComparer.instance,
    ) {

    }

    compare(x: T, y: T): number {
        const xMaped = this.selector(x);
        const yMaped = this.selector(y);
        const compareResult = this.comparer.compare(xMaped, yMaped);
        return compareResult;
    }

    equals(x: T, y: T): boolean {
        const xMaped = this.selector(x);
        const yMaped = this.selector(y);
        return this.comparer.equals(xMaped, yMaped);
    }
    getHashCode(obj: T): number {
        const mapedValue = this.selector(obj);
        return this.comparer.getHashCode(mapedValue);
    }

}


export type MapComparerModel = {
    [key: string]: OrderEqualityComparer;
};

export type MapComparerValue<TModel extends MapComparerModel = MapComparerModel> = {
    [TKey in keyof TModel]:
    TModel[TKey] extends OrderEqualityComparer<infer TValue> ? TValue : never;
};

export class MapComparer<TModel extends MapComparerModel> implements
    OrderEqualityComparer<MapComparerValue<TModel>> {

    constructor(
        readonly model: TModel,
    ) {

    }

    entries = Object.entries(this.model);

    compare(
        x: MapComparerValue<TModel>,
        y: MapComparerValue<TModel>
    ): number {

        for (const entry of this.entries) {
            const xValue = x[entry[0]];
            const yValue = y[entry[0]];
            const comparerResult =
                entry[1].compare(xValue, yValue);
            if (comparerResult !== 0) {
                return comparerResult;
            }
        }
        return 0;
    }

    equals(
        x: MapComparerValue<TModel>,
        y: MapComparerValue<TModel>
    ): boolean {

        for (const entry of this.entries) {
            const xValue = x[entry[0]];
            const yValue = y[entry[0]];
            if (!entry[1].equals(xValue, yValue)) {
                return false;
            }
        }
        return true;
    }

    getHashCode(
        obj: MapComparerValue<TModel>
    ): number {
        const hashCodes = this.entries.map(entry => entry[1].getHashCode(obj[entry[0]]));
        const sum = hashCodes.reduce((pre, cur) => pre + cur, 0);
        return sum;
    }
}