export type Result<T, E = string> = Success<T> | Failure<E>;

export class Success<T> {
    readonly isSuccess = true;
    readonly isFailure = false;
    constructor(readonly value: T) {}

    getOrElse(): T {
        return this.value;
    }

    map(): Result<T, never> {
        return this;
    }

    flatMap<U>(): Result<U, never> {
        return this as unknown as Success<U>;
    }
}

export class Failure<E> {
    readonly isSuccess = false;
    readonly isFailure = true;
    constructor(readonly error: E) {}

    getOrElse<T>(defaultValue: T): T {
        return defaultValue;
    }

    map(): Result<never, E> {
        return this as unknown as Failure<E>;
    }

    flatMap(): Result<never, E> {
        return this;
    }
}

export const ok = <T>(value: T): Result<T, never> => new Success(value);
export const err = <E>(error: E): Result<never, E> => new Failure(error);

export const isOk = <T>(result: Result<T>): result is Success<T> => result.isSuccess;
export const isErr = <T>(result: Result<T>): result is Failure<string> => result.isFailure;
