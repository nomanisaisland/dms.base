
export class Slot<T = unknown> {
    constructor(
        public value: T,
    ) {

    }
}

export class FuncSlot<T = unknown> implements Slot<T> {

    constructor(
        public get: () => T,
        public set = (value: T) => {
            this.get = () => value;
        },
    ) {

    }

    get value() {
        return this.get();
    }
    set value(value: T) {
        this.set(value);
    }
}