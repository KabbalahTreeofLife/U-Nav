import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { diningApi, type DiningLocation } from '../api';
import { useAuth, useUniversities } from '../common';
import { UniversityDropdownSelect } from '../common/UniversityDropdownSelect';

type DiningType = DiningLocation['type'];
type PriceRange = DiningLocation['priceRange'];

const TYPE_OPTIONS: { value: DiningType; label: string }[] = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'mess', label: 'Mess Hall' },
  { value: 'snack', label: 'Snacks & Drinks' },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: '$', label: '$ (Budget)' },
  { value: '$$', label: '$$ (Moderate)' },
  { value: '$$$', label: '$$$ (Premium)' },
];

interface DiningFormData {
  name: string;
  type: DiningType;
  building: string;
  floor: string;
  operatingHours: string;
  priceRange: PriceRange;
  cuisine: string;
  rating: string;
  imageUrl: string;
  universityId: number;
}

const initialFormData: DiningFormData = {
  name: '',
  type: 'restaurant',
  building: '',
  floor: '1',
  operatingHours: '',
  priceRange: '$',
  cuisine: '',
  rating: '4.0',
  imageUrl: '',
  universityId: 1,
};

export const DiningAdmin: React.FC = () => {
  const { universityId: userUniversityId, isGlobalAdmin, user } = useAuth();
  const { universities } = useUniversities();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number>(0);
  const [locations, setLocations] = useState<DiningLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DiningType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDbId, setEditingDbId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DiningFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const uniId = isGlobalAdmin ? selectedUniversityId : (userUniversityId || 1);
    const result = await diningApi.getLocations(uniId === 0 ? undefined : uniId);
    
    if (result.success && result.data) {
      setLocations(result.data);
      setError(null);
    } else {
      setError('error' in result ? result.error : 'Failed to fetch dining locations');
    }
    setLoading(false);
  }, [selectedUniversityId, userUniversityId, isGlobalAdmin]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const filteredLocations = locations.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || loc.type === filterType;
    const locUniversityId = loc.universityId || 1;
    const matchesUniversity = selectedUniversityId === 0 || locUniversityId === selectedUniversityId;
    return matchesSearch && matchesType && matchesUniversity;
  });

  const openAddModal = () => {
    const defaultUniversityId = isGlobalAdmin 
      ? (selectedUniversityId || userUniversityId || 1)
      : (userUniversityId || 1);
    setFormData({ ...initialFormData, universityId: defaultUniversityId });
    setEditingId(null);
    setEditingDbId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (location: DiningLocation) => {
    setFormData({
      name: location.name,
      type: location.type,
      building: location.building,
      floor: location.floor.toString(),
      operatingHours: location.operatingHours,
      priceRange: location.priceRange,
      cuisine: location.cuisine.join(', '),
      rating: location.rating.toString(),
      imageUrl: location.imageUrl || '',
      universityId: location.universityId || 1,
    });
    setEditingId(location.id);
    setEditingDbId(location.isFromDb ? parseInt(location.id.replace('db-', '')) : null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingDbId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    const cuisineArray = formData.cuisine
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c);

    try {
      if (editingId) {
        const updateData = {
          name: formData.name,
          type: formData.type,
          building: formData.building,
          floor: parseInt(formData.floor),
          operatingHours: formData.operatingHours,
          priceRange: formData.priceRange,
          cuisine: cuisineArray,
          rating: parseFloat(formData.rating),
          imageUrl: formData.imageUrl || undefined,
        };

        if (editingDbId) {
          const result = await diningApi.updateLocation(editingDbId, updateData, user?.id || 0);
          if (result.success) {
            await fetchLocations();
          } else {
            alert(result.error);
            setActionLoading(false);
            return;
          }
        } else {
          setLocations((prev) =>
            prev.map((loc) =>
              loc.id === editingId
                ? { ...loc, ...updateData }
                : loc
            )
          );
        }
      } else {
        const createData = {
          universityId: formData.universityId,
          name: formData.name,
          type: formData.type,
          building: formData.building,
          floor: parseInt(formData.floor),
          operatingHours: formData.operatingHours,
          priceRange: formData.priceRange,
          cuisine: cuisineArray,
          rating: parseFloat(formData.rating),
          imageUrl: formData.imageUrl || undefined,
        };

        const result = await diningApi.createLocation(createData, user?.id || 0);
        if (result.success) {
          await fetchLocations();
        } else {
          alert(result.error);
          setActionLoading(false);
          return;
        }
      }
      closeModal();
    } catch (err) {
      console.error('Error saving dining location:', err);
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: string, isFromDb: boolean) => {
    setActionLoading(true);
    
    if (isFromDb) {
      const dbId = parseInt(id.replace('db-', ''));
      const result = await diningApi.deleteLocation(dbId, user?.id || 0);
      if (result.success) {
        await fetchLocations();
      } else {
        alert(result.error);
      }
    } else {
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    }
    
    setShowDeleteConfirm(null);
    setActionLoading(false);
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Dining Locations</h1>
          <p>Manage dining options for your university</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isGlobalAdmin && (
            <UniversityDropdownSelect
              value={selectedUniversityId}
              onChange={setSelectedUniversityId}
              universities={[{ id: 0, name: 'All Universities', email_domain: '' }, ...universities]}
            />
          )}
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Location
          </button>
        </div>
      </div>

      <div className="admin-content-card">
        <div className="admin-content-header">
          <h2>All Locations ({filteredLocations.length})</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="admin-filters">
            <button
              className={`admin-filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`admin-filter-btn ${filterType === opt.value ? 'active' : ''}`}
                onClick={() => setFilterType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-empty-state">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="admin-empty-state" style={{ color: 'var(--color-error)' }}>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={fetchLocations}>Retry</button>
          </div>
        ) : filteredLocations.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Hours</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => (
                <tr key={location.id}>
                  <td>
                    <strong>{location.name}</strong>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-primary">{location.type}</span>
                  </td>
                  <td>{location.building}</td>
                  <td>{location.operatingHours}</td>
                  <td>{location.priceRange}</td>
                  <td>{location.rating.toFixed(1)}</td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn-icon success"
                        onClick={() => openEditModal(location)}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="admin-btn-icon danger"
                        onClick={() => setShowDeleteConfirm(location.id)}
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
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            </svg>
            <h3>No dining locations</h3>
            <p>Add your first dining location to get started</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Location' : 'Add Location'}</h2>
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
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Campus Coffee Shop"
                  />
                </div>

                <div className="admin-form-group">
                  <label>University *</label>
                  {isGlobalAdmin ? (
                    <select
                      value={formData.universityId}
                      onChange={(e) => setFormData({ ...formData, universityId: Number(e.target.value) })}
                      required
                    >
                      {universities.map((uni) => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={universities.find(u => u.id === userUniversityId)?.name || 'Your University'}
                      disabled
                      style={{ backgroundColor: 'var(--color-bg)', cursor: 'not-allowed' }}
                    />
                  )}
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as DiningType })}
                      required
                    >
                      {TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Price Range *</label>
                    <select
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as PriceRange })}
                      required
                    >
                      {PRICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Location *</label>
                    <input
                      type="text"
                      value={formData.building}
                      onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                      required
                      placeholder="e.g., Student Center"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Floor *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Operating Hours *</label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    required
                    placeholder="e.g., 7:00 AM - 9:00 PM"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Cuisine (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.cuisine}
                      onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                      placeholder="e.g., Filipino, International, Fast Food"
                    />
                    <span className="admin-form-hint">Separate multiple cuisines with commas</span>
                  </div>
                  <div className="admin-form-group">
                    <label>Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Image URL (optional)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Location
                </button>
              </div>
            </form>
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
              <p>Are you sure you want to delete this dining location? This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button 
                className="btn" 
                style={{ background: 'var(--color-error)', color: 'white' }} 
                onClick={() => handleDelete(showDeleteConfirm, showDeleteConfirm.startsWith('db-'))}
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

export default DiningAdmin;
