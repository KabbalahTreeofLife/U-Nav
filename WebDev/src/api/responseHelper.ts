export type ResponseResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string };

export async function handleResponse<T>(response: Response): Promise<ResponseResult<T>> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error: errorData.error };
    }
    
    const data: T = await response.json();
    return { success: true, data };
}
