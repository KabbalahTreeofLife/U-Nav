import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { diningApi, eventsApi } from '../api';
import { useAuth, useUniversities } from '../common';
import { UniversityDropdownSelect } from '../common/UniversityDropdownSelect';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { universityId, user, isGlobalAdmin } = useAuth();
  const { universities } = useUniversities();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number>(0);
  const [diningLocations, setDiningLocations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const effectiveUniversityId = isGlobalAdmin ? selectedUniversityId : universityId;
  const isAllUniversities = effectiveUniversityId === 0;

  useEffect(() => {
    const fetchData = async () => {
      const uniId = isAllUniversities ? undefined : (effectiveUniversityId || undefined);
      
      const [diningResult, eventsResult] = await Promise.all([
        diningApi.getLocations(uniId),
        eventsApi.getEvents(uniId),
      ]);
      
      if (diningResult.success && diningResult.data) {
        setDiningLocations(diningResult.data);
      }
      if (eventsResult.success && eventsResult.data) {
        setEvents(eventsResult.data);
      }
    };
    
    fetchData();
  }, [selectedUniversityId, universityId, isGlobalAdmin]);

  const totalDining = diningLocations.length;
  const totalEvents = events.length;
  const totalUniversities = universities.length;

  const stats = [
    ...(isGlobalAdmin ? [{
      label: 'Universities',
      value: totalUniversities,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      ),
      variant: 'warning' as const,
      onClick: () => navigate('/admin/universities'),
    }] : []),
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
  ];

  return (
    <AdminLayout>
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Welcome back, {user?.username || 'Admin'}</h1>
          <p>{isGlobalAdmin ? 'Manage all universities' : 'Manage your university'}</p>
        </div>
        {isGlobalAdmin && (
          <div className="university-selector">
            <span className="selector-label">Viewing:</span>
            <UniversityDropdownSelect
              value={selectedUniversityId}
              onChange={setSelectedUniversityId}
              universities={[{ id: 0, name: 'All Universities', email_domain: '' }, ...universities]}
              className="admin-dropdown"
            />
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
