import { HashMap } from '../value/HashMap';
import { PropertyKeyComparer } from "../value/PropertyKeyComparer";
import { Slot } from '../value/Slot';
import { SyncEvent } from '../async/SyncEvent';
import { OrderEqualityComparer, DefaultComparer } from '../value/Comparer';
import { MapComparer } from '../value/CompareUtil';
import { InvalidOperationException } from '../value/Exception';
import { ArrayUtil } from '../value/ArrayUtil';
import { SimpleStateError } from './SimpleStateError';
import { RecordObject } from '../value/RecordUtil';

export class SimpleStateKey {

    protected constructor(
        readonly container: unknown,
        readonly propKey: PropertyKey,

    ) {

    }

    static from = function (
        container: unknown,
        propKey: PropertyKey,
    ) {
        return new SimpleStateKey(container, propKey);
    }

}

export class SimpleStateKeyComparer
    implements OrderEqualityComparer<SimpleStateKey> {

    protected comparer = new MapComparer({
        container: DefaultComparer.instance,
        propKey: PropertyKeyComparer.instance,
    });

    compare(x: SimpleStateKey, y: SimpleStateKey): number {
        if (x.container === null || x.container === undefined) {
            return -1;
        }
        if (y.container === null || y.container === undefined) {
            return 1;
        }
        return this.comparer.compare(x, y);
    }

    equals(x: SimpleStateKey, y: SimpleStateKey): boolean {
        if (x.container === null || x.container === undefined) {
            return false;
        }
        if (y.container === null || y.container === undefined) {
            return false;
        }
        return this.comparer.equals(x, y);
    }

    getHashCode(obj: SimpleStateKey): number {
        return this.comparer.getHashCode(obj);
    }

    static instance = new SimpleStateKeyComparer();
}


export class SimpleStateDict {

    protected store =
        new HashMap<SimpleStateKey, SimpleStateEntry>(
            SimpleStateKeyComparer.instance
        );

    updateEvent = new SyncEvent();

    get(
        key: SimpleStateKey
    ): SimpleStateEntry | undefined {
        const entry = this.store.getOrDefault(key);
        return entry;
    }

    set(
        key: SimpleStateKey,
        value: SimpleStateEntry
    ): void {
        return this.store.put(key, value);
    }

    has(
        key: SimpleStateKey
    ): boolean {
        return this.store.has(key);
    }

    remove(
        key: SimpleStateKey
    ): boolean {
        return this.store.remove(key);
    }

    reflect(
        key: SimpleStateKey
    ): SimpleStateEntry {
        const entry = this.get(key);
        if (!entry) {
            const reflEntry = new SimpleStateEntry(this, key);
            this.set(key, reflEntry);
            return reflEntry;
        }
        return entry;
    }

    flatKeys(
        key: SimpleStateKey
    ): SimpleStateKey[] {

        const allEntries = HashMap.from(
            ArrayUtil.groupBy(
                this.store.entries(),
                a => a.key.container,
            ),
            a => a.key,
            a => a.list,
        );

        const flat = (
            entryKey: SimpleStateKey,
            handled: HashMap<SimpleStateKey, boolean>,
        ): SimpleStateKey[] => {
            if (handled.has(entryKey)) {
                return [];
            }
            handled.add(entryKey, true);
            const entryValue = this.get(entryKey);
            if (!entryValue) {
                return [];
            }
            const childEntries = allEntries.getOrDefault(entryValue.data);
            if (!childEntries) {
                return [entryKey];
            }
            const childEntryKeys = childEntries.flatMap(a => flat(a.key, handled));
            return [entryKey, ...childEntryKeys,];
        };
        const flatEntriesHandled = new HashMap<SimpleStateKey, boolean>(
            SimpleStateKeyComparer.instance,
        );
        const flatEntries = flat(key, flatEntriesHandled);
        return flatEntries;
    }
}

export class SimpleStateEntry<TData = unknown> {

    constructor(
        readonly stateDict: SimpleStateDict,
        readonly stateKey: SimpleStateKey,
    ) {

    }

    static fromCreateSlot<T>(
        value: T,
        stateDict = new SimpleStateDict(),
    ) {
        const valueSlot = new Slot(value);
        const stateKey = SimpleStateKey.from(valueSlot, "value");
        const stateEntry = new SimpleStateEntry<T>(
            stateDict,
            stateKey,
        );
        return stateEntry;
    }

    child<
        TKey extends PropertyKey = keyof NonNullable<TData>,
        TModelA extends TData = TData
    >(
        key: TKey,
    ): SimpleStateEntry<
        TKey extends keyof TModelA ?
        TModelA[TKey] :
        TKey extends keyof NonNullable<TModelA> ?
        NonNullable<TModelA>[TKey] | undefined :
        unknown
    > {
        return this.stateDict.reflect(SimpleStateKey.from(this.data, key)) as any;
    }

    flatEntries(): SimpleStateEntry[] {
        const flatKeys = this.stateDict.flatKeys(this.stateKey);
        const flatEntries = flatKeys.map(key => this.stateDict.reflect(key));
        return flatEntries;
    }

    get data(): TData {
        if (
            !(this.stateKey.container instanceof Object)
        ) {
            return undefined!;
        }
        const value = Reflect.get(
            this.stateKey.container,
            this.stateKey.propKey
        ) as TData;
        return value;
    }

    set data(value: TData) {
        if (
            !(this.stateKey.container instanceof Object)
        ) {
            throw new InvalidOperationException();
        }
        Reflect.set(
            this.stateKey.container,
            this.stateKey.propKey, value
        );
    }

    errors: SimpleStateError[] = [];

    get errorMessage() {
        return this.errors[0]?.message;
    }

    set errorMessage(value) {
        this.errors = !value ? [] : [{ message: value, }];
    }

    validating = false;

    touched = false;

    adjs: RecordObject = {};

}