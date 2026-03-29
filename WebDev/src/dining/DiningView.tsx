import React, { useState, useMemo } from 'react';
import { TopNav, BottomNav } from '../common';
import { diningLocations, getDiningIcon, getTypeLabel } from './data';
import type { DiningLocation } from './data';
import '../css/Dining/Dining.css';

type FilterType = 'all' | 'restaurant' | 'cafe' | 'mess' | 'snack';

export const DiningView: React.FC = () => {
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLocations = useMemo(() => {
        return diningLocations.filter((location) => {
            const matchesFilter = filter === 'all' || location.type === filter;
            const matchesSearch = 
                location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery]);

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
            <TopNav title="U-Nav" />
            
            <div className="dining-search">
                <input
                    type="text"
                    placeholder="Search restaurants, cafes, or cuisine..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
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
                <span>{location.building}, Floor {location.floor}</span>
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
