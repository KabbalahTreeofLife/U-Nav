import { useState, useEffect } from 'react';
import { authApi } from '../api';
import type { University } from '../api/types';

interface UseUniversitiesReturn {
    universities: University[];
    isLoading: boolean;
    error: string | null;
}

export const useUniversities = (): UseUniversitiesReturn => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            const result = await authApi.getUniversities();
            if (!cancelled) {
                if (result.success) {
                    setUniversities(result.data.universities);
                } else {
                    setError(result.error);
                }
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, []);

    return { universities, isLoading, error };
};
