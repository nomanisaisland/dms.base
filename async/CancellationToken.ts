import { OperationCanceledException } from '../value/Exception';

export class CancellationToken {

    /**
     * 标识是否已经取消
     */
    requested: boolean = false;

    requestMessage?: unknown;

    throwIfRequested(): void {
        if (this.requested) {
            throw new OperationCanceledException(
                String(this.requestMessage),
                this.requestMessage
            );
        }
    }

    protected callbackList?: ((requestMessage?: unknown) => void)[] = undefined;

    register(callback: (requestMessage?: unknown) => void): () => void {
        if (this.requested) {
            callback(this.requestMessage);
            return () => { };
        }
        if (!this.callbackList) {
            this.callbackList = [];
        }
        const callbackList = this.callbackList;

        let removed = false;
        const wrap = (requestMessage) => {
            if (removed) {
                return;
            }
            callback(requestMessage);
        };
        callbackList.push(wrap)
        return () => {
            removed = true;
        };
    }

    protected cancelProtected(requestMessage?: unknown): void {
        void requestMessage;
    }

    protected static noneValue = new CancellationToken();

    static none = function (): CancellationToken {
        return this.noneValue;
    }

}
export class SourceCancellationToken extends CancellationToken {

    /**
     * 取消
     */
    cancel(requestMessage?: unknown): void {
        if (this.requested) {
            return;
        }
        this.requested = true;
        this.requestMessage = requestMessage;
        if (!!this.callbackList) {
            for (const callback of this.callbackList) {
                callback(this.requestMessage);
            }
            this.callbackList = undefined;
        }
    }
}

export const cancelTokenLink = function (
    ct1: CancellationToken,
    ct2: CancellationToken,
): SourceCancellationToken {
    const ct = new SourceCancellationToken();
    ct1.register(() => {
        ct.cancel();
    });
    ct2.register(() => {
        ct.cancel();
    });
    return ct;
};


export function cancelTokenRefCreate() {
    const ctRef = {
        current: new SourceCancellationToken(),
        cut(requestMessage?) {
            ctRef.current.cancel(requestMessage);
            ctRef.current = new SourceCancellationToken();
            return ctRef.current;
        },
    };
    return ctRef;
}

