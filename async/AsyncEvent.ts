import { ArrayUtil, ArrayEffectUtil } from '../value/ArrayUtil';

export interface AsyncEventControllerResult<T> {
    value?: [T];
    break?: boolean;
}

export interface AsyncEventController<T> {
    value: T;
    result: (value: AsyncEventControllerResult<T>) =>
        AsyncEventControllerResult<T>;
}

export type AsyncEventListener<T> = (
    value: T,
    controller: AsyncEventController<T>,
) => Promise<AsyncEventControllerResult<T> | void | T> |
    AsyncEventControllerResult<T> | void | T;

export interface AsyncEventRegister<T = never> {

    add(listener: AsyncEventListener<T>): boolean;

    remove(listener: AsyncEventListener<T>): boolean;

    removeAdd(listener: AsyncEventListener<T>): boolean;

    has(listener: AsyncEventListener<T>): boolean;

    regist(listener: AsyncEventListener<T>): () => void;
}

export class AsyncEvent<T = never>
    implements AsyncEventRegister<T> {

    constructor(
        public defaultValue:
            () => T =
            () => undefined!,
    ) {

    }

    protected listeners: AsyncEventListener<T>[] = [];

    async trigger(
        value: T = this.defaultValue(),
    ): Promise<T> {
        for (const listener of this.listeners.slice().reverse()) {
            const controller = {
                value,
                resultList: [] as AsyncEventControllerResult<T>[],
                result(result: AsyncEventControllerResult<T>) {
                    this.resultList.push(result);
                    return result;
                },
                resultCheck(value: unknown):
                    value is AsyncEventControllerResult<T> {
                    return this.resultList.indexOf(value as any) >= 0;
                },
            };
            const listenerResult = await listener(value, controller);
            if (controller.resultCheck(listenerResult)) {
                if (!!listenerResult.value) {
                    value = listenerResult.value[0];
                }
                if (!!listenerResult.break) {
                    break;
                }
                continue;
            }
            if (typeof listenerResult === "undefined") {
                continue;
            }
            value = listenerResult;
        }
        return value;
    }

    add(listener: AsyncEventListener<T>): boolean {
        if (this.has(listener)) {
            return false;
        }
        this.listeners.push(listener);
        return true;
    }

    remove(listener: AsyncEventListener<T>): boolean {
        const index = this.listeners.indexOf(listener);
        return this.listeners.splice(index, 1).length > 0;
    }

    removeAdd(listener: AsyncEventListener<T>): boolean {
        return this.remove(listener) && this.add(listener);
    }

    has(listener: AsyncEventListener<T>): boolean {
        return ArrayUtil.contains(this.listeners, listener);
    }

    clear(): void {
        this.listeners.splice(0);
    }

    regist(
        listener: AsyncEventListener<T>
    ) {
        this.add(listener);
        const unregist = () => {
            this.remove(listener);
        };
        return unregist;
    }

    register: AsyncEventRegister<T> = {
        add: (listener) => this.add(listener),
        remove: (listener) => this.remove(listener),
        removeAdd: (listener) => this.removeAdd(listener),
        has: (listener) => this.has(listener),
        regist: (listener) => this.regist(listener),
    };
}

export class BroadcastAsyncEventRegister<T = never>
    implements AsyncEventRegister<T> {

    constructor(
        public list: AsyncEventRegister<T>[],
    ) {

    }

    add(listener: AsyncEventListener<T>): boolean {
        const reduce = this.list.reduce((pre, cur) => {
            return cur.add(listener) || pre;
        }, false);
        return reduce;
    }
    remove(listener: AsyncEventListener<T>): boolean {
        const reduce = this.list.reduce((pre, cur) => {
            return cur.remove(listener) || pre;
        }, false);
        return reduce;
    }

    removeAdd(listener: AsyncEventListener<T>): boolean {
        const reduce = this.list.reduce((pre, cur) => {
            return cur.removeAdd(listener) || pre;
        }, false);
        return reduce;
    }

    has(listener: AsyncEventListener<T>): boolean {
        return this.list.some(a => a.has(listener));
    }

    regist(listener: AsyncEventListener<T>): () => void {
        return this.list.reduce((pre, cur) => {
            const dispose = cur.regist(listener);
            return () => {
                pre();
                dispose();
            };
        }, () => { });
    }
}
