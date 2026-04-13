import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav, BottomNav, useUniversities } from '../../common';
import { CampusScene } from './CampusScene';
import { getUniversityMap, getDefaultMap, type UniversityMap } from './universities';
import { eventsApi } from '../../api';
import type { Event } from '../../api';
import { useAuth } from '../../common/AuthContext';
import { UniversityDropdownSelect } from '../../common/UniversityDropdownSelect';
import { geolocationService, type GPSPosition, type ModelPosition } from './geolocation';
import { coordinateTransformer } from './coordinateTransform';
import { buildingDataService, type BuildingLocation, type RoomLocation } from './buildingData';
import { navigationService, type NavigationResult } from './navigation';
import '../../css/Map/Map.css';

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

const SCALE_METERS_PER_UNIT = 16.25;

export const MapView3D: React.FC = () => {
    const navigate = useNavigate();
    const { isGuest, universityId, isGlobalAdmin } = useAuth();
    const { universities } = useUniversities();
    const [selectedUniversityId, setSelectedUniversityId] = useState<number>(universityId || 1);
    const [showHeatMap, setShowHeatMap] = useState(false);
    const [showEvents, setShowEvents] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ buildings: BuildingLocation[]; rooms: RoomLocation[] }>({ buildings: [], rooms: [] });
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<BuildingLocation | RoomLocation | null>(null);
    const [destinationPosition, setDestinationPosition] = useState<ModelPosition | null>(null);
    const [destinationName, setDestinationName] = useState<string>('');
    const [navigationInfo, setNavigationInfo] = useState<NavigationResult | null>(null);

    const [userGPS, setUserGPS] = useState<GPSPosition | null>(null);
    const [userPosition, setUserPosition] = useState<ModelPosition | null>(null);
    const [gpsError, setGpsError] = useState<string | null>(null);
    const [isTrackingGPS, setIsTrackingGPS] = useState(false);
    const [gpsPermission, setGpsPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [nearestBuilding, setNearestBuilding] = useState<BuildingLocation | null>(null);
    const [isIndoor, setIsIndoor] = useState(false);

    const effectiveUniversityId = isGlobalAdmin ? selectedUniversityId : (universityId || 1);

    const universityMap: UniversityMap = useMemo(() => {
        if (!effectiveUniversityId || effectiveUniversityId === 0) {
            return getDefaultMap();
        }
        const map = getUniversityMap(effectiveUniversityId);
        return map || getDefaultMap();
    }, [effectiveUniversityId]);

    const glbUrl = universityMap.glbFile || undefined;
    const showPlaceholder = !universityMap.glbFile;

    useEffect(() => {
        const fetchEvents = async () => {
            const result = await eventsApi.getEvents(effectiveUniversityId);
            if (result.success && result.data) {
                setEvents(result.data);
            }
        };
        fetchEvents();
    }, [effectiveUniversityId]);

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const results = buildingDataService.searchAll(searchQuery);
            setSearchResults(results);
            setShowSearchResults(true);
        } else {
            setSearchResults({ buildings: [], rooms: [] });
            setShowSearchResults(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const searchBar = document.querySelector('.map-search-bar');
            const dropdown = document.querySelector('.search-results-dropdown');
            
            if (searchBar && !searchBar.contains(target) && (!dropdown || !dropdown.contains(target))) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const INDOOR_THRESHOLD_METERS = 20;

    const findNearestBuildingAndCheckIndoor = useCallback((modelPos: ModelPosition) => {
        const buildings = buildingDataService.getAllBuildings();
        let nearest: BuildingLocation | null = null;
        let minDistance = Infinity;

        for (const building of buildings) {
            const distance = navigationService.calculateDistance(modelPos, building.modelPosition) * SCALE_METERS_PER_UNIT;
            if (distance < minDistance) {
                minDistance = distance;
                nearest = building;
            }
        }

        setNearestBuilding(nearest);
        
        if (nearest && minDistance < INDOOR_THRESHOLD_METERS) {
            setIsIndoor(true);
        } else {
            setIsIndoor(false);
        }

        return nearest;
    }, []);

    useEffect(() => {
        if (!geolocationService.isSupported()) {
            setGpsError('Geolocation is not supported by your browser');
            setGpsPermission('denied');
            return;
        }

        const startAutoGPS = async () => {
            try {
                const initialPosition = await geolocationService.getCurrentPosition();
                setUserGPS(initialPosition);
                
                const modelPos = coordinateTransformer.gpsToModel({
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                });
                setUserPosition(modelPos);
                findNearestBuildingAndCheckIndoor(modelPos);
                setGpsPermission('granted');
                setIsTrackingGPS(true);

                geolocationService.watchPosition(
                    (gpsPos) => {
                        setUserGPS(gpsPos);
                        const modelPos = coordinateTransformer.gpsToModel({
                            latitude: gpsPos.latitude,
                            longitude: gpsPos.longitude,
                        });
                        setUserPosition(modelPos);
                        findNearestBuildingAndCheckIndoor(modelPos);

                        if (destinationPosition) {
                            const navResult = navigationService.calculatePath(modelPos, destinationPosition, true, SCALE_METERS_PER_UNIT);
                            setNavigationInfo(navResult);
                        }
                    },
                    (error) => {
                        setGpsError(error);
                    }
                );
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Failed to get location';
                if (errorMsg.includes('permission') || errorMsg.includes('denied')) {
                    setGpsPermission('denied');
                } else {
                    setGpsError(errorMsg);
                }
            }
        };

        startAutoGPS();

        return () => {
            geolocationService.stopWatching();
        };
    }, [destinationPosition, findNearestBuildingAndCheckIndoor]);

    const handleSelectDestination = useCallback((building: BuildingLocation | RoomLocation) => {
        setSelectedDestination(building);
        
        let position: ModelPosition;
        let name: string;

        if ('buildingId' in building) {
            const parentBuilding = buildingDataService.getBuildingById(building.buildingId);
            position = building.modelPosition;
            name = `${building.name} (${parentBuilding?.name || 'Unknown'})`;
        } else {
            position = building.modelPosition;
            name = building.name;
        }

        setDestinationPosition(position);
        setDestinationName(name);
        setShowSearchResults(false);
        setSearchQuery(name);

        if (userPosition) {
            const navResult = navigationService.calculatePath(userPosition, position, true, SCALE_METERS_PER_UNIT);
            setNavigationInfo(navResult);
        }
    }, [userPosition]);

    const handleClearDestination = useCallback(() => {
        setSelectedDestination(null);
        setDestinationPosition(null);
        setDestinationName('');
        setNavigationInfo(null);
    }, []);

    const centerOnUser = useCallback(() => {
        if (userPosition) {
            console.log('Center on user:', userPosition);
        }
    }, [userPosition]);

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

                <div className="map-search-container" style={{ position: 'relative', flex: 1 }}>
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
                            onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                        />
                        {selectedDestination && (
                            <button 
                                className="clear-destination-btn"
                                onClick={handleClearDestination}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="16" height="16">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {showSearchResults && (searchResults.buildings.length > 0 || searchResults.rooms.length > 0) && (
                        <div className="search-results-dropdown">
                            {searchResults.buildings.length > 0 && (
                                <div className="search-section">
                                    <div className="search-section-title">Buildings</div>
                                    {searchResults.buildings.map((building) => (
                                        <div 
                                            key={building.id}
                                            className="search-result-item"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelectDestination(building);
                                            }}
                                        >
                                            <span className="result-icon">🏢</span>
                                            <div className="result-info">
                                                <span className="result-name">{building.name}</span>
                                                <span className="result-detail">{building.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searchResults.rooms.length > 0 && (
                                <div className="search-section">
                                    <div className="search-section-title">Rooms</div>
                                    {searchResults.rooms.map((room) => {
                                        const building = buildingDataService.getBuildingById(room.buildingId);
                                        return (
                                            <div 
                                                key={room.id}
                                                className="search-result-item"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelectDestination(room);
                                                }}
                                            >
                                                <span className="result-icon">🚪</span>
                                                <div className="result-info">
                                                    <span className="result-name">{room.name}</span>
                                                    <span className="result-detail">{building?.name || 'Unknown Building'}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="map-icon-buttons">
                    {userPosition && (
                        <button
                            className="map-icon-btn"
                            onClick={centerOnUser}
                            title="Center on my location"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" fill="currentColor" />
                            </svg>
                            <span>Center</span>
                        </button>
                    )}

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

            {gpsError && (
                <div className="gps-error-banner">
                    <span>⚠️ {gpsError}</span>
                    <button onClick={() => setGpsError(null)}>Dismiss</button>
                </div>
            )}

            {gpsPermission === 'denied' && (
                <div className="gps-warning-banner">
                    <span>📍 Location access denied. Enable GPS in browser settings to track your position.</span>
                </div>
            )}

            {isTrackingGPS && userGPS && (
                <div className="gps-info-bar">
                    <span>📍 Your location: {userGPS.latitude.toFixed(6)}, {userGPS.longitude.toFixed(6)}</span>
                    <span className="accuracy-info">Accuracy: ±{Math.round(userGPS.accuracy)}m</span>
                </div>
            )}

            {navigationInfo && (
                <div className="navigation-info-bar">
                    <div className="nav-direction">
                        <span className="nav-distance">📏 {Math.round(navigationInfo.totalDistanceMeters)}m</span>
                        <span className="nav-time">⏱️ ~{navigationInfo.estimatedTimeMinutes} min</span>
                    </div>
                    <div className="nav-instruction">
                        {navigationInfo.waypoints[1]?.instruction}
                    </div>
                </div>
            )}

            {isTrackingGPS && isIndoor && nearestBuilding && (
                <div className="indoor-indicator">
                    <div className="indoor-status">
                        <span className="indoor-icon">🏢</span>
                        <span className="indoor-building">Inside {nearestBuilding.name}</span>
                    </div>
                </div>
            )}

            <div className="map-3d-view">
                {showPlaceholder ? (
                    <div className="map-placeholder">
                        <div className="placeholder-content">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="placeholder-icon">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                            <h3>3D Map To Be Added</h3>
                            <p>The 3D map for this university is currently under development.</p>
                        </div>
                    </div>
                ) : (
                    <CampusScene 
                        glbUrl={glbUrl}
                        userPosition={userPosition}
                        accuracy={userGPS?.accuracy ?? 10}
                        scaleMetersPerUnit={SCALE_METERS_PER_UNIT}
                        destinationPosition={destinationPosition}
                        destinationName={destinationName}
                        showUserDot={isTrackingGPS}
                        navigationWaypoints={navigationInfo?.waypoints.map(wp => wp.position) ?? null}
                        disableControls={showSearchResults}
                    />
                )}
            </div>

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

export default MapView3D;