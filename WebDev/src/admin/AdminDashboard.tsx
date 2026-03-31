import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getDiningByUniversity } from '../dining/data';
import { getEventsByUniversity } from '../map/data';
import { useAuth, useUniversities } from '../common';

const ALL_UNIVERSITY_IDS = [1, 2, 3, 4, 5, 6];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { universityId, user, isGlobalAdmin } = useAuth();
  const { universities } = useUniversities();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number>(universityId || 1);

  const effectiveUniversityId = isGlobalAdmin ? selectedUniversityId : universityId;
  
  const diningLocations = effectiveUniversityId ? getDiningByUniversity(effectiveUniversityId) : [];
  const events = effectiveUniversityId ? getEventsByUniversity(effectiveUniversityId) : [];

  const totalDining = isGlobalAdmin 
    ? ALL_UNIVERSITY_IDS.reduce((sum, id) => sum + getDiningByUniversity(id).length, 0)
    : diningLocations.length;
  
  const totalEvents = isGlobalAdmin
    ? ALL_UNIVERSITY_IDS.reduce((sum, id) => sum + getEventsByUniversity(id).length, 0)
    : events.length;

  const stats = [
    {
      label: 'Dining Locations',
      value: totalDining,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        </svg>
      ),
      variant: 'primary' as const,
      onClick: () => navigate('/admin/dining'),
    },
    {
      label: 'Events',
      value: totalEvents,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      variant: 'success' as const,
      onClick: () => navigate('/admin/events'),
    },
    {
      label: 'Universities',
      value: 6,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      ),
      variant: 'warning' as const,
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Welcome back, {user?.username || 'Admin'}</h1>
          <p>{isGlobalAdmin ? 'Manage all universities' : 'Manage your university'}</p>
        </div>
        {isGlobalAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Viewing:</label>
            <select
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(Number(e.target.value))}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                background: 'white',
              }}
            >
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="admin-stats">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="admin-stat-card"
            onClick={stat.onClick}
            style={{ cursor: stat.onClick ? 'pointer' : 'default' }}
          >
            <div className={`admin-stat-icon ${stat.variant}`}>{stat.icon}</div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="admin-content-card">
          <div className="admin-content-header">
            <h2>Recent Dining Locations</h2>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/admin/dining')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              View All
            </button>
          </div>
          {diningLocations.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {diningLocations.slice(0, 5).map((location) => (
                  <tr key={location.id}>
                    <td>{location.name}</td>
                    <td>
                      <span className="admin-badge admin-badge-primary">
                        {location.type}
                      </span>
                    </td>
                    <td>{location.rating.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty-state">
              <p>No dining locations found</p>
            </div>
          )}
        </div>

        <div className="admin-content-card">
          <div className="admin-content-header">
            <h2>Upcoming Events</h2>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/admin/events')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              View All
            </button>
          </div>
          {events.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${getCategoryVariant(event.category)}`}>
                        {event.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty-state">
              <p>No events found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const getCategoryVariant = (category: string): string => {
  switch (category) {
    case 'academic':
      return 'primary';
    case 'sports':
      return 'success';
    case 'cultural':
      return 'warning';
    case 'social':
      return 'error';
    default:
      return 'primary';
  }
};

export default AdminDashboard;
