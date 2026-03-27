export type Result<T, E = string> = 
    | { success: true; data: T; error?: never }
    | { success: false; data?: never; error: E };

export const ok = <T>(data: T): Result<T, never> => ({ success: true, data });
export const err = <E>(error: E): Result<never, E> => ({ success: false, error });

export const isOk = <T>(result: Result<T>): result is { success: true; data: T } => result.success === true;
export const isErr = <E>(result: Result<unknown, E>): result is { success: false; error: E } => result.success === false;
