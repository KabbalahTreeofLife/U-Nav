import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, BottomNav, useUniversities } from '../../common';
import { eventsApi } from '../../api';
import type { Event } from '../../api';
import { useAuth } from '../../common/AuthContext';
import { UniversityDropdownSelect } from '../../common/UniversityDropdownSelect';
import '../../css/Map/Map.css';

export const MapView2D: React.FC = () => {
    const navigate = useNavigate();
    const { universityId, isGuest, isGlobalAdmin } = useAuth();
    const { universities } = useUniversities();
    const [selectedUniversityId, setSelectedUniversityId] = useState<number>(universityId || 1);
    const [showHeatMap, setShowHeatMap] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showEvents, setShowEvents] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    const effectiveUniversityId = isGlobalAdmin ? selectedUniversityId : (universityId || 1);

    useEffect(() => {
        const fetchEvents = async () => {
            const result = await eventsApi.getEvents(effectiveUniversityId);
            if (result.success && result.data) {
                setEvents(result.data);
            }
        };
        fetchEvents();
    }, [effectiveUniversityId]);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="map-container">
            <TopNav title="University Navigate" />
            
            <div className="map-controls">
                {isGlobalAdmin && (
                    <UniversityDropdownSelect
                        value={selectedUniversityId}
                        onChange={setSelectedUniversityId}
                        universities={universities}
                    />
                )}

                <div className="map-search-bar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search buildings, rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="map-icon-buttons">
                    <button
                        className="map-icon-btn map-view-toggle"
                        onClick={() => navigate('/map/3d')}
                        title="Switch to 3D"
                    >
                        <span>3D</span>
                    </button>

                    {!isGuest && (
                        <>
                            <button
                                className={`map-icon-btn ${showHeatMap ? 'active' : ''}`}
                                onClick={() => setShowHeatMap(!showHeatMap)}
                                title="Toggle Heat Map"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                                    <path d="M21 5v6c0 1.66-4 3-9 3s-9-1.34-9-3V5" />
                                    <path d="M21 11v6c0 1.66-4 3-9 3s-9-1.34-9-3v-6" />
                                </svg>
                                <span>Heat</span>
                            </button>

                            <button
                                className="map-icon-btn"
                                onClick={() => setShowEvents(true)}
                                title="View Events"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span>Events</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="map-content">
                <div className="map-view-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h2>Campus Map - 2D View</h2>
                    <p>
                        {showHeatMap 
                            ? 'Heat map enabled - Showing crowd density' 
                            : '2D map view coming soon'}
                    </p>
                </div>
            </div>

            {showEvents && (
                <EventsModal 
                    events={filteredEvents} 
                    onClose={() => setShowEvents(false)} 
                />
            )}

            <BottomNav />
        </div>
    );
};

const getCategoryColor = (category: string): string => {
    switch (category) {
        case 'academic': return '#3b82f6';
        case 'sports': return '#10b981';
        case 'cultural': return '#8b5cf6';
        case 'social': return '#f59e0b';
        default: return '#6b7280';
    }
};

const getCategoryLabel = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
};

interface EventsModalProps {
    events: Event[];
    onClose: () => void;
}

const EventsModal: React.FC<EventsModalProps> = ({ events, onClose }) => {
    return (
        <div className="events-modal-overlay" onClick={onClose}>
            <div className="events-modal" onClick={(e) => e.stopPropagation()}>
                <div className="events-modal-header">
                    <h2>University Events</h2>
                    <button className="events-modal-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="events-modal-content">
                    {events.length === 0 ? (
                        <div className="events-empty">
                            <p>No events found</p>
                        </div>
                    ) : (
                        <div className="events-list">
                            {events.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div 
                                        className="event-category"
                                        style={{ backgroundColor: getCategoryColor(event.category) }}
                                    >
                                        {getCategoryLabel(event.category)}
                                    </div>
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <div className="event-details">
                                        <div className="event-detail">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="event-detail">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12,6 12,12 16,14" />
                                            </svg>
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="event-detail">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <span>{event.room}</span>
                                        </div>
                                        <div className="event-detail">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            <span>{event.organizer}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapView2D;
