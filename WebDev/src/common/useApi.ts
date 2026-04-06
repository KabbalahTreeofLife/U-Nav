import { useState, useCallback } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiOptions {
    onSuccess?: (data: unknown) => void;
    onError?: (error: string) => void;
}

export const useApi = <T,>(apiFn: () => Promise<{ success: boolean; data?: T; error?: string }>, options?: UseApiOptions) => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        try {
            const result = await apiFn();
            
            if (result.success) {
                setState({ data: result.data as T, loading: false, error: null });
                options?.onSuccess?.(result.data);
                return result;
            } else {
                const errorMsg = result.error || 'An error occurred';
                setState({ data: null, loading: false, error: errorMsg });
                options?.onError?.(errorMsg);
                return result;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred';
            setState({ data: null, loading: false, error: errorMsg });
            options?.onError?.(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, [apiFn, options]);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
};
