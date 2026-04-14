import React, { useState, useEffect } from 'react';
import { TopNav, BottomNav, useUniversities } from '../common';
import { diningApi } from '../api';
import type { DiningLocation } from '../api';
import { useAuth } from '../common/AuthContext';
import { UniversityDropdownSelect } from '../common/UniversityDropdownSelect';
import '../css/Dining/Dining.css';

type FilterType = 'all' | 'restaurant' | 'cafe' | 'mess' | 'snack';

const getTypeLabel = (type: string): string => {
    switch (type) {
        case 'restaurant': return 'Restaurant';
        case 'cafe': return 'Cafe';
        case 'mess': return 'Mess Hall';
        case 'snack': return 'Snacks & Drinks';
        default: return type;
    }
};

const getDiningIcon = (type: string): string => {
    switch (type) {
        case 'restaurant': return 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z';
        case 'cafe': return 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v2M10 2v2M14 2v2';
        case 'mess': return 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z';
        case 'snack': return 'M12 2a10 10 0 1 0 10 10H12V2zM8 14s1.5 2 4 2 4-2 4-2';
        default: return 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z';
    }
};

export const DiningView: React.FC = () => {
    const { universityId, isGlobalAdmin } = useAuth();
    const { universities } = useUniversities();
    const [selectedUniversityId, setSelectedUniversityId] = useState<number>(universityId || 1);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [diningLocations, setDiningLocations] = useState<DiningLocation[]>([]);

    const effectiveUniversityId = isGlobalAdmin ? selectedUniversityId : (universityId || 1);

    useEffect(() => {
        const fetchDining = async () => {
            const result = await diningApi.getLocations(effectiveUniversityId);
            if (result.success && result.data) {
                setDiningLocations(result.data);
            }
        };
        fetchDining();
    }, [effectiveUniversityId]);

    const filteredLocations = diningLocations.filter((location) => {
        const matchesFilter = filter === 'all' || location.type === filter;
        const matchesSearch = 
            location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
            location.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="star half">★</span>);
            } else {
                stars.push(<span key={i} className="star">★</span>);
            }
        }
        return stars;
    };

    return (
        <div className="dining-container">
            <TopNav showLogo={true} />
            
            <div className="dining-controls">
                {isGlobalAdmin && (
                    <UniversityDropdownSelect
                        value={selectedUniversityId}
                        onChange={setSelectedUniversityId}
                        universities={universities}
                        className="dropdown-small"
                    />
                )}
                
                <div className="dining-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search restaurants, cafes, or cuisine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="dining-filters">
                {(['all', 'restaurant', 'cafe', 'mess', 'snack'] as FilterType[]).map((type) => (
                    <button
                        key={type}
                        className={`filter-btn ${filter === type ? 'active' : ''}`}
                        onClick={() => setFilter(type)}
                    >
                        {type === 'all' ? 'All' : getTypeLabel(type)}
                    </button>
                ))}
            </div>

            <div className="dining-content">
                {filteredLocations.length === 0 ? (
                    <div className="no-results">
                        <p>No dining locations found</p>
                    </div>
                ) : (
                    <div className="dining-grid">
                        {filteredLocations.map((location) => (
                            <DiningCard 
                                key={location.id} 
                                location={location} 
                                renderStars={renderStars}
                            />
                        ))}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

interface DiningCardProps {
    location: DiningLocation;
    renderStars: (rating: number) => React.ReactNode;
}

const DiningCard: React.FC<DiningCardProps> = ({ location, renderStars }) => {
    return (
        <div className="dining-card">
            <div className="dining-card-header">
                <div className={`dining-type-badge ${location.type}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d={getDiningIcon(location.type)} />
                    </svg>
                    <span>{getTypeLabel(location.type)}</span>
                </div>
                <div className="dining-price">
                    {location.priceRange}
                </div>
            </div>
            
            <h3 className="dining-name">{location.name}</h3>
            
            <div className="dining-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                    {location.building}
                    {location.floor !== null ? `, Floor ${location.floor}` : ''}
                </span>
            </div>

            <div className="dining-cuisine">
                {location.cuisine.map((c, index) => (
                    <span key={index} className="cuisine-tag">{c}</span>
                ))}
            </div>

            <div className="dining-footer">
                <div className="dining-rating">
                    {renderStars(location.rating)}
                    <span className="rating-number">{location.rating.toFixed(1)}</span>
                </div>
                <div className="dining-hours">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>{location.operatingHours}</span>
                </div>
            </div>
        </div>
    );
};

export default DiningView;
