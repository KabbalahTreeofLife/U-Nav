export type ResponseResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string };