import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { usersApi } from '../api';
import type { User, UserRole } from '../api/types';
import { useAuth, useUniversities } from '../common';
import { UniversityDropdownSelect } from '../common/UniversityDropdownSelect';

export const UsersAdmin: React.FC = () => {
  const { isGlobalAdmin, universityId: userUniversityId, isAdmin, user } = useAuth();
  const { universities } = useUniversities();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [showEditModal, setShowEditModal] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('user');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const result = await usersApi.getUsers();
      
      if (!cancelled) {
        if (result.success) {
          setUsers(result.data.users);
        } else {
          setError(result.error);
        }
        setLoading(false);
      }
    };
    
    fetchUsers();
    
    return () => {
      cancelled = true;
    };
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await usersApi.getUsers();
    if (result.success) {
      setUsers(result.data.users);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    let matchesUniversity = true;
    if (isGlobalAdmin) {
      matchesUniversity = selectedUniversityId === 0 || user.university_id === selectedUniversityId || (user.university_id === null && selectedUniversityId === 0);
    } else if (isAdmin) {
      matchesUniversity = user.university_id === userUniversityId;
    }
    
    return matchesSearch && matchesRole && matchesUniversity;
  });

  const canEditUser = (targetUser: User): boolean => {
    if (targetUser.isGlobalAdmin) return false;
    if (targetUser.id === user?.id) return false;
    if (isGlobalAdmin) return true;
    if (isAdmin && targetUser.university_id !== userUniversityId) return false;
    return isAdmin;
  };

  const canDeleteUser = (targetUser: User): boolean => {
    if (user?.id === targetUser.id) return false;
    if (targetUser.isGlobalAdmin) return false;
    if (isGlobalAdmin) return true;
    if (isAdmin && targetUser.university_id !== userUniversityId) return false;
    return isAdmin;
  };

  const handleEditClick = (user: User) => {
    setEditRole(user.role || 'user');
    setShowEditModal(user);
  };

  const handleSaveRole = async () => {
    if (!showEditModal) return;
    
    setActionLoading(true);
    const payload: { role: UserRole; university_id?: number | null } = { role: editRole };
    if (editRole === 'global') {
      payload.university_id = null;
    }
    
    const result = await usersApi.updateUserRole(showEditModal.id, payload, user?.id || 0);
    
    if (result.success) {
      await loadUsers();
      setShowEditModal(null);
    } else {
      alert(result.error);
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    
    setActionLoading(true);
    const result = await usersApi.deleteUser(showDeleteConfirm.id, user?.id || 0);
    
    if (result.success) {
      await loadUsers();
      setShowDeleteConfirm(null);
    } else {
      alert(result.error);
    }
    setActionLoading(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBadge = (user: User) => {
    if (user.isGlobalAdmin || (user.role === 'admin' && user.university_id === null)) {
      return <span className="admin-badge admin-badge-warning">Global Admin</span>;
    }
    if (user.role === 'admin') {
      return <span className="admin-badge admin-badge-success">Admin ({user.university_name || 'Unknown'})</span>;
    }
    return <span className="admin-badge admin-badge-primary">User</span>;
  };

  const getUserUniversityName = (user: User): string => {
    if (user.university_id === null) return 'N/A';
    const uni = universities.find(u => u.id === user.university_id);
    return uni?.name || `ID: ${user.university_id}`;
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>User Management</h1>
          <p>{isGlobalAdmin ? 'Manage all user accounts' : 'Manage accounts for your university'}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isGlobalAdmin && (
            <div className="university-selector">
              <UniversityDropdownSelect
                value={selectedUniversityId}
                onChange={setSelectedUniversityId}
                universities={[{ id: 0, name: 'All Universities', email_domain: '' }, ...universities]}
                className="admin-dropdown"
              />
            </div>
          )}
          <button className="btn btn-outline" onClick={loadUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="admin-content-card">
        <div className="admin-content-header">
          <h2>All Users ({filteredUsers.length})</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="admin-filters">
            <button
              className={`admin-filter-btn ${filterRole === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRole('all')}
            >
              All
            </button>
            <button
              className={`admin-filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
              onClick={() => setFilterRole('admin')}
            >
              Admins
            </button>
            <button
              className={`admin-filter-btn ${filterRole === 'user' ? 'active' : ''}`}
              onClick={() => setFilterRole('user')}
            >
              Users
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem 1.5rem', color: 'var(--color-error)' }}>
            {error}
          </div>
        )}

        {filteredUsers.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>University</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.email}</strong>
                  </td>
                  <td>{user.username || 'N/A'}</td>
                  <td>{getUserUniversityName(user)}</td>
                  <td>{getRoleBadge(user)}</td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="admin-actions">
                      {canEditUser(user) && (
                        <button
                          className="admin-btn-icon success"
                          onClick={() => handleEditClick(user)}
                          title="Edit Role"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      )}
                      {canDeleteUser(user) && (
                        <button
                          className="admin-btn-icon danger"
                          onClick={() => setShowDeleteConfirm(user)}
                          title="Delete"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>No users found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {showEditModal && (
        <div className="admin-modal-overlay" onClick={() => setShowEditModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Edit User Role</h2>
              <button className="admin-modal-close" onClick={() => setShowEditModal(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <p><strong>Email:</strong> {showEditModal.email}</p>
                <p><strong>Username:</strong> {showEditModal.username || 'N/A'}</p>
                <p><strong>University:</strong> {getUserUniversityName(showEditModal)}</p>
                <p><strong>Created:</strong> {formatDate(showEditModal.created_at)}</p>
              </div>

              <div className="admin-form-group">
                <label>Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  {isGlobalAdmin && (
                    <option value="global">Global Admin</option>
                  )}
                </select>
                <span className="admin-form-hint">
                  {isGlobalAdmin 
                    ? 'Global Admin has access to all universities. University Admin is limited to their university.'
                    : 'You can promote this user to Admin for your university.'
                  }
                </span>
              </div>

              <div className="admin-form-group">
                <label>University</label>
                <input
                  type="text"
                  value={getUserUniversityName(showEditModal)}
                  disabled
                  style={{ backgroundColor: 'var(--color-bg)', cursor: 'not-allowed' }}
                />
                <span className="admin-form-hint">
                  University cannot be changed once assigned.
                </span>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowEditModal(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveRole} disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="admin-modal-header">
              <h2>Confirm Delete</h2>
              <button className="admin-modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>Are you sure you want to delete this user?</p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <p><strong>Email:</strong> {showDeleteConfirm.email}</p>
                <p><strong>Username:</strong> {showDeleteConfirm.username || 'N/A'}</p>
                <p><strong>University:</strong> {getUserUniversityName(showDeleteConfirm)}</p>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--color-error)' }}>This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn"
                style={{ background: 'var(--color-error)', color: 'white' }}
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersAdmin;
