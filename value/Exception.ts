export class Exception extends Error {

    constructor(
        message?: string,
        public messageData: any = undefined,
    ) {
        super(message);

        const newTarget = this.constructor;
        if (!(this instanceof newTarget)) {
            Reflect.setPrototypeOf(this, newTarget.prototype);
        }
    }

    throw(): never {
        throw this;
    }
}

export class NotSupportedException extends Exception {

}

export class NotImplementedException extends Exception {

}

export class InvalidOperationException extends Exception {

}

export class AnonymException extends Exception {

    static valueMessage = function (
        value: unknown
    ): string {
        return JSON.stringify(value);
    }

    constructor(
        public value: unknown,
    ) {
        super(AnonymException.valueMessage(value));
    }

    static errorFrom = function (
        value: unknown | Error
    ): Error {
        const error = value instanceof Error ?
            value : new this(value);
        return error;
    }

    static exceptionFrom = function (
        value: unknown | Exception
    ) {
        const error = value instanceof Exception ?
            value : new this(value);
        return error;
    }
}

export class OperationCanceledException extends Exception {

}