import { useMemo, useCallback } from 'react';
import type { User } from '../api/types';
import { useAuth } from '../common/AuthContext';

interface UserPermission {
    canEdit: boolean;
    canDelete: boolean;
    error?: string;
}

export const useUserPermissions = (targetUser: User) => {
    const { user, isGlobalAdmin, isAdmin, universityId: userUniversityId } = useAuth();

    const canEditUser = useCallback((): boolean => {
        if (!user) return false;
        if (targetUser.isGlobalAdmin) return false;
        if (targetUser.id === user.id) return false;
        if (isGlobalAdmin) return true;
        if (isAdmin && targetUser.university_id !== userUniversityId) return false;
        return isAdmin;
    }, [user, targetUser, isGlobalAdmin, isAdmin, userUniversityId]);

    const canDeleteUser = useCallback((): boolean => {
        if (!user) return false;
        if (user.id === targetUser.id) return false;
        if (targetUser.isGlobalAdmin) return false;
        if (isGlobalAdmin) return true;
        if (isAdmin && targetUser.university_id !== userUniversityId) return false;
        return isAdmin;
    }, [user, targetUser, isGlobalAdmin, isAdmin, userUniversityId]);

    const getPermission = useMemo((): UserPermission => {
        return {
            canEdit: canEditUser(),
            canDelete: canDeleteUser(),
        };
    }, [canEditUser, canDeleteUser]);

    return getPermission;
};

export const useUserFilters = (users: User[], searchQuery: string, filterRole: 'all' | 'admin' | 'user') => {
    const { isGlobalAdmin, isAdmin, universityId: userUniversityId } = useAuth();

    return useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            
            const matchesRole = filterRole === 'all' || u.role === filterRole;
            
            let matchesUniversity = true;
            if (isGlobalAdmin) {
                matchesUniversity = u.university_id === userUniversityId || u.university_id === null;
            } else if (isAdmin) {
                matchesUniversity = u.university_id === userUniversityId;
            }
            
            return matchesSearch && matchesRole && matchesUniversity;
        });
    }, [users, searchQuery, filterRole, isGlobalAdmin, isAdmin, userUniversityId]);
};
