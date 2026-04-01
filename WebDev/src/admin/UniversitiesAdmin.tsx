import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { authApi } from '../api';
import { useAuth } from '../common';
import type { University } from '../api/types';

interface UniversityFormData {
    name: string;
    email_domain: string;
}

const initialFormData: UniversityFormData = {
    name: '',
    email_domain: '',
};

export const UniversitiesAdmin: React.FC = () => {
    const { user } = useAuth();
    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
    const [formData, setFormData] = useState<UniversityFormData>(initialFormData);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<University | null>(null);

    const fetchUniversities = useCallback(async () => {
        setLoading(true);
        setError(null);
        const result = await authApi.getUniversities();
        
        if (result.success && result.data) {
            setUniversities(result.data.universities);
        } else {
            setError('Failed to fetch universities');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUniversities();
    }, [fetchUniversities]);

    const filteredUniversities = universities.filter((uni) => {
        const matchesSearch =
            uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            uni.email_domain.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const openAddModal = () => {
        setFormData(initialFormData);
        setEditingUniversity(null);
        setIsModalOpen(true);
    };

    const openEditModal = (university: University) => {
        setFormData({
            name: university.name,
            email_domain: university.email_domain,
        });
        setEditingUniversity(university);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUniversity(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user?.id) {
            alert('User not authenticated');
            return;
        }
        
        setActionLoading(true);

        try {
            if (editingUniversity) {
                alert('Editing not implemented yet - use database directly');
            } else {
                const result = await authApi.createUniversity(formData, user.id);
                if (result.success) {
                    await fetchUniversities();
                    closeModal();
                } else {
                    alert(result.error);
                }
            }
        } catch (err) {
            console.error('Error saving university:', err);
        }
        setActionLoading(false);
    };

    const handleDelete = async () => {
        if (!user?.id || !deleteConfirm) return;
        
        setActionLoading(true);
        try {
            const result = await authApi.deleteUniversity(deleteConfirm.id, user.id);
            if (result.success) {
                await fetchUniversities();
                setDeleteConfirm(null);
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Error deleting university:', err);
        }
        setActionLoading(false);
    };

    return (
        <AdminLayout>
            <div className="admin-header">
                <div className="admin-header-left">
                    <h1>Universities</h1>
                    <p>Manage universities in the system</p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    + Add University
                </button>
            </div>

            <div className="admin-content-card">
                <div className="admin-content-header">
                    <h2>All Universities ({filteredUniversities.length})</h2>
                    <div className="admin-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search universities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="admin-empty-state">
                        <p>Loading...</p>
                    </div>
                ) : error ? (
                    <div className="admin-empty-state" style={{ color: 'var(--color-error)' }}>
                        <p>{error}</p>
                        <button className="btn btn-outline" onClick={fetchUniversities}>Retry</button>
                    </div>
                ) : filteredUniversities.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Domain</th>
                                <th>ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUniversities.map((uni) => (
                                <tr key={uni.id}>
                                    <td><strong>{uni.name}</strong></td>
                                    <td>{uni.email_domain}</td>
                                    <td>{uni.id}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-btn-icon success"
                                                onClick={() => openEditModal(uni)}
                                                title="Edit"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="admin-btn-icon danger"
                                                onClick={() => setDeleteConfirm(uni)}
                                                title="Delete"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="admin-empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                        </svg>
                        <h3>No universities</h3>
                        <p>Add your first university to get started</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingUniversity ? 'Edit University' : 'Add University'}</h2>
                            <button className="admin-modal-close" onClick={closeModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-modal-body">
                                <div className="admin-form-group">
                                    <label>University Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="e.g., University of Technology"
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Email Domain *</label>
                                    <input
                                        type="text"
                                        value={formData.email_domain}
                                        onChange={(e) => setFormData({ ...formData, email_domain: e.target.value })}
                                        required
                                        placeholder="e.g., ut.edu.ph"
                                    />
                                    <span className="admin-form-hint">Users must register with this domain</span>
                                </div>
                            </div>
                            <div className="admin-modal-footer">
                                <button type="button" className="btn btn-outline" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                                    {actionLoading ? 'Saving...' : (editingUniversity ? 'Update' : 'Add')} University
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="admin-modal-header">
                            <h2>Confirm Delete</h2>
                            <button className="admin-modal-close" onClick={() => setDeleteConfirm(null)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
                            <p style={{ color: 'var(--color-error)', marginTop: '0.5rem' }}>This action cannot be undone.</p>
                        </div>
                        <div className="admin-modal-footer">
                            <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </button>
                            <button
                                className="btn"
                                style={{ background: 'var(--color-error)', color: 'white' }}
                                onClick={handleDelete}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default UniversitiesAdmin;