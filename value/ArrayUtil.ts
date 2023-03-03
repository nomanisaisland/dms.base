import { OrderComparer, EqualityComparer, DefaultComparer } from './Comparer';

export type Grouping<TKey, TElement> = {
    key: TKey;
    list: TElement[];
};

export class ArrayUtil {

    static containsAll<T>(
        input: T[],
        items: T[],
        comparer: EqualityComparer<T> =
            DefaultComparer.instance
    ): boolean {
        const output = items.every(item =>
            ArrayUtil.contains(input, item, comparer)
        );
        return output;
    }

    static contains<T>(
        input: T[],
        item: T,
        comparer: EqualityComparer<T> =
            DefaultComparer.instance
    ): boolean {
        const output = input.some(a =>
            comparer.equals(a, item)
        );
        return output;
    }

    static distinct<T>(
        input: T[],
        comparer: OrderComparer<T> = DefaultComparer.instance
    ): T[] {
        const output = input.filter(
            (a, i) => input.findIndex(
                (aa) => comparer.compare(aa, a) === 0
            ) === i
        );
        return output;
    }

    static orderByQuickSort<T, TMaped>(
        input: T[],
        selector: (item: T) => TMaped = a => a as any,
        comparer: OrderComparer<TMaped> = DefaultComparer.instance
    ): T[] {
        if (input.length < 2) {
            return input.slice();
        }
        const { l, m, r } = input.slice(1).reduce(
            ({ l, m, r }, cur) =>
                comparer.compare(
                    selector(cur),
                    selector(m[0]),
                ) < 0 ?
                    { l: [...l, cur], m, r, } :
                    { l, m, r: [...r, cur], },
            { l: [], m: input.slice(0, 1), r: [] },
        );
        return [
            ...this.orderByQuickSort(l, selector, comparer),
            ...m,
            ...this.orderByQuickSort(r, selector, comparer),
        ];
    }

    static orderBy<T, TMaped>(
        input: T[],
        selector: (item: T) => TMaped = a => a as any,
        comparer: OrderComparer<TMaped> = DefaultComparer.instance,
        chaos = false,
    ): T[] {
        if (!chaos) {
            return this.orderByQuickSort(input, selector, comparer);
        }
        const output = input.map(
            source => ({
                source,
                sort: selector(source),
            })
        ).sort(
            (a, b) => comparer.compare(
                a.sort,
                b.sort
            )
        ).map(a => a.source);
        return output;
    }

    static orderByDesc<T, TMaped>(
        input: T[],
        selector: (item: T) => TMaped = a => a as any,
        comparer: OrderComparer<TMaped> = DefaultComparer.instance,
        chaos = false,
    ): T[] {
        const output = ArrayUtil.orderBy(input, selector, comparer, chaos).reverse();
        return output;
    }

    static sum<T, TMaped = T>(
        input: T[],
        map: (item: T) => TMaped = a => a as any,
        add: (a: TMaped, b: TMaped) => TMaped = (a, b) => a as any + b,
        initValue: TMaped = 0 as any,
    ): TMaped {
        return input.reduce((pre, cur) => add(pre, map(cur)), initValue);
    }

    static max<T, TMaped>(
        input: T[],
        map: (item: T) => TMaped = a => a as any,
        comparer: OrderComparer<TMaped> = DefaultComparer.instance,
        initValue: TMaped = undefined!,
    ): TMaped {
        if (input.length < 1) {
            return initValue;
        }
        return input.reduce(
            (pre, cur) => {
                const mapedCur = map(cur);
                return comparer.compare(pre, mapedCur) > 0 ? pre : mapedCur;
            },
            map(input[0]),
        );
    }

    static min<T, TMaped>(
        input: T[],
        map: (item: T) => TMaped = a => a as any,
        comparer: OrderComparer<TMaped> = DefaultComparer.instance,
        initValue: TMaped = undefined!,
    ): TMaped {
        if (input.length < 1) {
            return initValue;
        }
        return input.reduce(
            (pre, cur) => {
                const mapedCur = map(cur);
                return comparer.compare(pre, mapedCur) < 0 ? pre : mapedCur;
            },
            map(input[0]),
        );
    }

    static groupBy<T = any, TKey = T>(
        input: T[],
        keySelector: (
            a: T,
            index: number,
        ) => TKey =
            (a) => a as unknown as TKey,
        comparer: EqualityComparer<TKey> =
            DefaultComparer.instance
    ): Grouping<TKey, T>[] {
        const output: Grouping<TKey, T>[] = [];
        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            const key = keySelector(item, i);
            const groupIndex = output.findIndex(
                a => comparer.equals(a.key, key)
            );
            if (groupIndex < 0) {
                output.push({ key, list: [item] });
                continue;
            }
            const group = output[groupIndex];
            group.list.push(item);
        }
        return output;
    }

    static range = function (
        max: number,
        min = 0
    ): number[] {
        return [
            min,
            ...min < max ? this.range(min + 1, max) : [],
        ];
    }
}

export class ArrayEffectUtil {

    static remove<T>(
        input: T[],
        item: T,
        comparer: OrderComparer<T> =
            DefaultComparer.instance,
    ): boolean {
        const index = input.findIndex(a =>
            comparer.compare(a, item) === 0
        );
        if (index < 0) {
            return false;
        }
        input.splice(index, 1);
        return true;
    }

    static removeAll<T>(
        input: T[],
        items: T[]
    ): T[] {
        const removed = [];
        for (const item of items) {
            if (this.remove(input, item)) {
                removed.push(item);
            }
        }
        return removed;
    }

    static removeFilter<T>(
        input: T[],
        predicate: (item: T, index: number) => boolean
    ): T[] {
        const items = input.filter(predicate);
        return this.removeAll(input, items);
    }

    static removeFilterEq<T>(
        input: T[],
        item: T,
        comparer: OrderComparer<T> = DefaultComparer.instance,
    ): T[] {
        return this.removeFilter(
            input,
            a => comparer.compare(a, item) === 0
        );
    }

    static clear<T>(input: T[]): void {
        input.splice(0);
    }
}