import { ArrayUtil, ArrayEffectUtil } from '../value/ArrayUtil';

export interface SyncEventControllerResult<T> {
    value?: [T];
    break?: boolean;
}

export interface SyncEventController<T> {
    value: T;
    result: (value: SyncEventControllerResult<T>) =>
        SyncEventControllerResult<T>;
}

export type SyncEventListener<T> = ((
    value: T,
    controller: SyncEventController<T>,
) => SyncEventControllerResult<T> | void | T) & {
    syncEventFastIndex?: number;
};

export interface SyncEventRegister<T> {

    add(listener: SyncEventListener<T>): boolean;

    remove(listener: SyncEventListener<T>): boolean;

    removeAdd(listener: SyncEventListener<T>): boolean;

    has(listener: SyncEventListener<T>): boolean;

    regist(listener: SyncEventListener<T>): () => void;
}

const fastIndexMode = true;

export class SyncEvent<T = any>
    implements SyncEventRegister<T> {

    constructor(
        public defaultValue:
            () => T =
            () => undefined!,
    ) {

    }

    protected listeners: SyncEventListener<T>[] = [];

    trigger(
        value: T = this.defaultValue(),
    ): T {
        for (const listener of this.listeners.slice().reverse()) {
            const controller = {
                value,
                resultList: [] as SyncEventControllerResult<T>[],
                result(result: SyncEventControllerResult<T>) {
                    this.resultList.push(result);
                    return result;
                },
                resultCheck(value: unknown):
                    value is SyncEventControllerResult<T> {
                    return this.resultList.indexOf(value as any) >= 0;
                },
            };
            const listenerResult = listener(value, controller);
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

    add(listener: SyncEventListener<T>): boolean {
        if (this.has(listener)) {
            return false;
        }
        if (fastIndexMode) {
            listener.syncEventFastIndex = this.listeners.length;
        }
        this.listeners.push(listener);
        return true;
    }

    remove(listener: SyncEventListener<T>): boolean {
        if (fastIndexMode) {
            if (this.listeners[listener.syncEventFastIndex] != listener) {
                listener.syncEventFastIndex = this.listeners.indexOf(listener);
            }
            this.listeners.splice(listener.syncEventFastIndex, 1);
            for (let i = listener.syncEventFastIndex; i < this.listeners.length; i++) {
                const next = this.listeners[i];
                next.syncEventFastIndex = i;
            }
            return listener.syncEventFastIndex >= 0;
        }
        const index = this.listeners.indexOf(listener);
        return this.listeners.splice(index, 1).length > 0;
    }

    removeAdd(listener: SyncEventListener<T>): boolean {
        return this.remove(listener) && this.add(listener);
    }

    has(listener: SyncEventListener<T>): boolean {
        if (fastIndexMode) {
            if (this.listeners[listener.syncEventFastIndex ?? -1] == listener) {
                return true;
            }
        }
        return ArrayUtil.contains(this.listeners, listener);
    }

    clear(): void {
        this.listeners.splice(0);
    }

    regist(
        listener: SyncEventListener<T>
    ) {
        this.add(listener);
        const unregist = () => {
            this.remove(listener);
        };
        return unregist;
    }

    register: SyncEventRegister<T> = {
        add: (listener) => this.add(listener),
        remove: (listener) => this.remove(listener),
        removeAdd: (listener) => this.removeAdd(listener),
        has: (listener) => this.has(listener),
        regist: (listener) => this.regist(listener),
    };
}

export class BroadcastSyncEventRegister<T = never>
    implements SyncEventRegister<T> {

    constructor(
        public list: SyncEventRegister<T>[],
    ) {

    }

    add(listener: SyncEventListener<T>): boolean {
        const reduce = this.list.reduce((pre, cur) => {
            return cur.add(listener) || pre;
        }, false);
        return reduce;
    }
    remove(listener: SyncEventListener<T>): boolean {
        const reduce = this.list.reduce((pre, cur) => {
            return cur.remove(listener) || pre;
        }, false);
        return reduce;
    }

    removeAdd(listener: SyncEventListener<T>): boolean {
        const reduce = this.list.reduce((pre, cur) => {
            return cur.removeAdd(listener) || pre;
        }, false);
        return reduce;
    }

    has(listener: SyncEventListener<T>): boolean {
        return this.list.some(a => a.has(listener));
    }

    regist(listener: SyncEventListener<T>): () => void {
        return this.list.reduce((pre, cur) => {
            const dispose = cur.regist(listener);
            return () => {
                pre();
                dispose();
            };
        }, () => { });
    }
}
