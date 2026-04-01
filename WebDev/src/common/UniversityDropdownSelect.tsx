import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { University } from '../api/types';

interface UniversityDropdownSelectProps {
  value: number;
  onChange: (value: number) => void;
  universities: University[];
  disabled?: boolean;
  className?: string;
}

export const UniversityDropdownSelect: React.FC<UniversityDropdownSelectProps> = ({
  value,
  onChange,
  universities,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedUniversity = universities.find((uni) => uni.id === value);

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (uni: University) => {
    onChange(uni.id);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchTerm('');
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredUniversities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredUniversities[highlightedIndex]) {
          handleSelect(filteredUniversities[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  return (
    <div className={`dropdown-container ${disabled ? 'dropdown-disabled' : ''} ${className}`} ref={containerRef}>
      {isOpen ? (
        <input
          ref={inputRef}
          type="text"
          className="dropdown-search-input"
          placeholder={selectedUniversity ? selectedUniversity.name : 'Search university...'}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          aria-label="Search universities"
        />
      ) : (
        <button
          type="button"
          className={`dropdown-trigger ${isOpen ? 'dropdown-open' : ''}`}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedUniversity ? 'dropdown-value' : 'dropdown-placeholder'}>
            {selectedUniversity ? selectedUniversity.name : 'Select University'}
          </span>
          <span className={`dropdown-arrow ${isOpen ? 'dropdown-arrow-up' : ''}`}>
            &#9662;
          </span>
        </button>
      )}

      {isOpen && (
        <div className="dropdown-menu" role="listbox">
          <div className="dropdown-options">
            {filteredUniversities.length === 0 ? (
              <div className="dropdown-no-results">No universities found</div>
            ) : (
              filteredUniversities.map((uni, index) => (
                <div
                  key={uni.id}
                  className={`dropdown-option ${index === highlightedIndex ? 'dropdown-option-highlighted' : ''} ${uni.id === value ? 'dropdown-option-selected' : ''}`}
                  onClick={() => handleSelect(uni)}
                  role="option"
                  aria-selected={uni.id === value}
                >
                  {uni.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
