import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import type { Event } from '../map/data';

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
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  room: '',
  date: '',
  time: '',
  organizer: '',
  category: 'academic',
};

const loadEvents = (): Event[] => {
  try {
    const stored = localStorage.getItem('admin_events');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEvents = (events: Event[]) => {
  localStorage.setItem('admin_events', JSON.stringify(events));
};

export const EventsAdmin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(loadEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<EventCategory | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.room.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const openAddModal = () => {
    setFormData(initialFormData);
    setEditingId(null);
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
    });
    setEditingId(event.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === editingId
            ? {
                ...evt,
                title: formData.title,
                description: formData.description,
                room: formData.room,
                date: formData.date,
                time: formData.time,
                organizer: formData.organizer,
                category: formData.category,
              }
            : evt
        )
      );
    } else {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        room: formData.room,
        date: formData.date,
        time: formData.time,
        organizer: formData.organizer,
        category: formData.category,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    setShowDeleteConfirm(null);
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
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Event
        </button>
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

        {sortedEvents.length > 0 ? (
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
                <tr key={event.id}>
                  <td>
                    <strong>{event.title}</strong>
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
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Add'} Event
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
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default EventsAdmin;
