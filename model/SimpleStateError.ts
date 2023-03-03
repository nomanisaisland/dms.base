import StringComparer from '../value/StringComparer';
import { AnonymException } from '../value/Exception';

export class SimpleStateError {

    code?: string;

    tag?: string;

    title?: string;

    message?: string;

    stack?: string;

    raw?: unknown;

    static tagEmpty = "";

    static tagComparer = StringComparer.ordinalIgnoreCase;

    static codeEmpty = "";

    static codeException = "Exception";

    static codeInvalid = "Invalid";

    static codeBindInvalid = "BindInvalid";

    static codeNotFound = "NotFound";

    static codeDuplicate = "Duplicate";

    static codeUnauth = "Unauth";

    static codeComparer = StringComparer.ordinalIgnoreCase;

    static fromNotFound = function (): SimpleStateError {
        const stateError = new this();
        stateError.code = this.codeNotFound;
        return stateError;
    }

    static fromDuplicate = function (): SimpleStateError {
        const stateError = new this();
        stateError.code = this.codeDuplicate;
        return stateError;
    }

    static fromInvalid = function (): SimpleStateError {
        const stateError = new this();
        stateError.code = this.codeInvalid;
        return stateError;
    }

    static fromBindInvalid = function (): SimpleStateError {
        const stateError = new this();
        stateError.code = this.codeBindInvalid;
        return stateError;
    }

    static fromException = function (
        exception: unknown | Error
    ) {
        const stateError = new this();
        const error = AnonymException.errorFrom(exception);
        stateError.code = this.codeException;
        stateError.message = error.message;
        stateError.stack = error.stack || error.toString();
        stateError.raw = exception;
        return stateError;
    }
}

