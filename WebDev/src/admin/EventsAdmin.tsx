import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { eventsApi, type Event } from '../api';
import { useAuth, useUniversities } from '../common';
import { UniversityDropdownSelect } from '../common/UniversityDropdownSelect';

type EventCategory = Event['category'];

const CATEGORY_OPTIONS: { value: EventCategory; label: string; color: string }[] = [
  { value: 'academic', label: 'Academic', color: 'primary' },
  { value: 'sports', label: 'Sports', color: 'success' },
  { value: 'cultural', label: 'Cultural', color: 'warning' },
  { value: 'social', label: 'Social', color: 'error' },
];

interface EventFormData {
  title: string;
  description: string;
  room: string;
  date: string;
  time: string;
  organizer: string;
  category: EventCategory;
  universityId: number;
  isPinned: boolean;
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  room: '',
  date: '',
  time: '',
  organizer: '',
  category: 'academic',
  universityId: 1,
  isPinned: false,
};

export const EventsAdmin: React.FC = () => {
  const { universityId: userUniversityId, isGlobalAdmin, user } = useAuth();
  const { universities } = useUniversities();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDbId, setEditingDbId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const uniId = isGlobalAdmin ? selectedUniversityId : (userUniversityId || 1);
    const result = await eventsApi.getEvents(uniId === 0 ? undefined : uniId);
    
    if (result.success && result.data) {
      setEvents(result.data);
      setError(null);
    } else {
      setError('error' in result ? result.error : 'Failed to fetch events');
    }
    setLoading(false);
  }, [selectedUniversityId, userUniversityId, isGlobalAdmin]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const eventUniversityId = event.universityId || 1;
    const matchesUniversity = selectedUniversityId === 0 || eventUniversityId === selectedUniversityId;
    return matchesSearch && matchesCategory && matchesUniversity;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
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

  const openEditModal = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      room: event.room,
      date: event.date,
      time: event.time,
      organizer: event.organizer,
      category: event.category,
      universityId: event.universityId || 1,
      isPinned: event.isPinned || false,
    });
    setEditingId(event.id);
    setEditingDbId(event.isFromDb ? parseInt(event.id.replace('db-', '')) : null);
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

    try {
      if (editingId) {
        const updateData = {
          title: formData.title,
          description: formData.description,
          room: formData.room,
          date: formData.date,
          time: formData.time,
          organizer: formData.organizer,
          category: formData.category,
          isPinned: formData.isPinned,
        };

        if (editingDbId) {
          const result = await eventsApi.updateEvent(editingDbId, updateData, user?.id || 0);
          if (result.success) {
            await fetchEvents();
          } else {
            alert(result.error);
            setActionLoading(false);
            return;
          }
        } else {
          setEvents((prev) =>
            prev.map((evt) =>
              evt.id === editingId
                ? { ...evt, ...updateData }
                : evt
            )
          );
        }
      } else {
        const createData = {
          universityId: formData.universityId,
          title: formData.title,
          description: formData.description,
          room: formData.room,
          date: formData.date,
          time: formData.time,
          organizer: formData.organizer,
          category: formData.category,
          isPinned: formData.isPinned,
        };

        const result = await eventsApi.createEvent(createData, user?.id || 0);
        if (result.success) {
          await fetchEvents();
        } else {
          alert(result.error);
          setActionLoading(false);
          return;
        }
      }
      closeModal();
    } catch (err) {
      console.error('Error saving event:', err);
    }
    setActionLoading(false);
  };

  const handleTogglePin = async (event: Event) => {
    if (!event.isFromDb) return;
    const dbId = parseInt(event.id.replace('db-', ''));
    const result = await eventsApi.updateEvent(dbId, { isPinned: !event.isPinned }, user?.id || 0);
    if (result.success) {
      await fetchEvents();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string, isFromDb: boolean) => {
    setActionLoading(true);
    
    if (isFromDb) {
      const dbId = parseInt(id.replace('db-', ''));
      const result = await eventsApi.deleteEvent(dbId, user?.id || 0);
      if (result.success) {
        await fetchEvents();
      } else {
        alert(result.error);
      }
    } else {
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    }
    
    setShowDeleteConfirm(null);
    setActionLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryVariant = (category: EventCategory): string => {
    const option = CATEGORY_OPTIONS.find((opt) => opt.value === category);
    return option?.color || 'primary';
  };

  return (
    <AdminLayout>
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Events</h1>
          <p>Manage events for your university</p>
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
            + Add Event
          </button>
        </div>
      </div>

      <div className="admin-content-card">
        <div className="admin-content-header">
          <h2>All Events ({sortedEvents.length})</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="admin-filters">
            <button
              className={`admin-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All
            </button>
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`admin-filter-btn ${filterCategory === opt.value ? 'active' : ''}`}
                onClick={() => setFilterCategory(opt.value)}
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
            <button className="btn btn-outline" onClick={fetchEvents}>Retry</button>
          </div>
        ) : sortedEvents.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Organizer</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event.id} style={event.isPinned ? { background: 'rgba(245, 158, 11, 0.05)' } : {}}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {event.isPinned && (
                        <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" width="14" height="14">
                          <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                        </svg>
                      )}
                      <strong>{event.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      {event.description.length > 60 ? `${event.description.slice(0, 60)}...` : event.description}
                    </div>
                  </td>
                  <td>
                    <div>{formatDate(event.date)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{event.time}</div>
                  </td>
                  <td>{event.room}</td>
                  <td>{event.organizer}</td>
                  <td>
                    <span className={`admin-badge admin-badge-${getCategoryVariant(event.category)}`}>
                      {event.category}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {event.isFromDb && (
                        <button
                          className="admin-btn-icon"
                          onClick={() => handleTogglePin(event)}
                          title={event.isPinned ? 'Unpin' : 'Pin to top'}
                          style={event.isPinned ? { color: '#f59e0b', borderColor: '#f59e0b' } : {}}
                        >
                          <svg viewBox="0 0 24 24" fill={event.isPinned ? '#f59e0b' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                          </svg>
                        </button>
                      )}
                      <button
                        className="admin-btn-icon success"
                        onClick={() => openEditModal(event)}
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="admin-btn-icon danger"
                        onClick={() => setShowDeleteConfirm(event.id)}
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h3>No events</h3>
            <p>Add your first event to get started</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingId ? 'Edit Event' : 'Add Event'}</h2>
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
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Annual Science Fair"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Describe the event..."
                    rows={3}
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
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                      required
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Organizer *</label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      required
                      placeholder="e.g., Student Council"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Location (Room) *</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    required
                    placeholder="e.g., Main Auditorium"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Time *</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#f59e0b' }}
                  />
                  <label htmlFor="isPinned" style={{ cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg viewBox="0 0 24 24" fill={formData.isPinned ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2" width="16" height="16">
                      <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z" />
                    </svg>
                    Pin this event to the top
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : (editingId ? 'Update' : 'Add')} Event
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
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
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

export default EventsAdmin;
