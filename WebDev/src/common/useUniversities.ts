import { useState, useEffect, useMemo } from 'react';
import { authApi } from '../api';
import type { University } from '../api/types';

interface UseUniversitiesReturn {
    universities: University[];
    isLoading: boolean;
    error: string | null;
    getUniversityById: (id: number) => University | undefined;
    getEmailDomainById: (id: number) => string | undefined;
}

export const useUniversities = (): UseUniversitiesReturn => {
    const [universities, setUniversities] = useState<University[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const universityMap = useMemo(() => {
        const map = new Map<number, University>();
        universities.forEach(uni => map.set(uni.id, uni));
        return map;
    }, [universities]);

    const getUniversityById = (id: number): University | undefined => {
        return universityMap.get(id);
    };

    const getEmailDomainById = (id: number): string | undefined => {
        const uni = universityMap.get(id);
        return uni?.email_domain;
    };

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

    return { universities, isLoading, error, getUniversityById, getEmailDomainById };
};
