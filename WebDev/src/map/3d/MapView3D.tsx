import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, BottomNav } from '../../common';
import { CampusScene } from './CampusScene';
import { getUniversityMap, getDefaultMap, type UniversityMap } from './universities';
import { getEventsByUniversity, getCategoryColor, getCategoryLabel } from '../data';
import { useAuth } from '../../common/AuthContext';
import type { Event } from '../data';
import '../../css/Map/Map.css';

export const MapView3D: React.FC = () => {
    const navigate = useNavigate();
    const { isGuest, universityId } = useAuth();
    const [showHeatMap, setShowHeatMap] = useState(false);
    const [showEvents, setShowEvents] = useState(false);

    const universityMap: UniversityMap = useMemo(() => {
        if (isGuest || !universityId) {
            return getDefaultMap();
        }
        const map = getUniversityMap(universityId);
        return map || getDefaultMap();
    }, [isGuest, universityId]);

    const glbUrl = isGuest ? undefined : universityMap.glbFile;

    const events = useMemo(() => {
        return getEventsByUniversity(universityId || 1);
    }, [universityId]);

    return (
        <div className="map-container">
            <TopNav title="University Navigate" />
            
            <div className="map-controls">
                <div className="map-search-bar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search buildings, rooms..."
                        onChange={(e) => console.log('Search:', e.target.value)}
                    />
                </div>

                <div className="map-icon-buttons">
                    <button
                        className="map-icon-btn map-view-toggle"
                        onClick={() => navigate('/map/2d')}
                        title="Switch to 2D"
                    >
                        <span>2D</span>
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

            <div className="map-3d-view">
                <CampusScene glbUrl={glbUrl} />
            </div>

            {isGuest && (
                <div className="guest-notice">
                    Guest mode: Building details are limited. Login for full access.
                </div>
            )}

            {showEvents && (
                <EventsModal 
                    events={events} 
                    onClose={() => setShowEvents(false)} 
                />
            )}
            
            <BottomNav />
        </div>
    );
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
                                            <span>{event.date}</span>
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

export default MapView3D;
