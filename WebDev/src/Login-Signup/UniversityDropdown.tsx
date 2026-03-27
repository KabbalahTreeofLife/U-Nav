import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { University } from '../api/types';

interface UniversityDropdownProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  universities: University[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const UniversityDropdown: React.FC<UniversityDropdownProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  universities,
  placeholder = 'Select your University',
  required = false,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = Boolean(error);

  const selectedUniversity = universities.find((uni) => String(uni.id) === value);

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (uni: University) => {
    const syntheticEvent = {
      target: {
        name,
        value: String(uni.id),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
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
      if (onBlur) {
        onBlur({
          target: containerRef.current,
        } as unknown as React.FocusEvent<HTMLSelectElement>);
      }
    }
  }, [onBlur]);

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
    <div className="input-group" ref={containerRef}>
      <label htmlFor={name} className="input-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>

      <div className={`dropdown-container ${hasError ? 'dropdown-error' : ''} ${disabled ? 'dropdown-disabled' : ''}`}>
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="dropdown-search-input"
            placeholder={selectedUniversity ? selectedUniversity.name : placeholder}
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
              {selectedUniversity ? selectedUniversity.name : placeholder}
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
                    className={`dropdown-option ${index === highlightedIndex ? 'dropdown-option-highlighted' : ''} ${String(uni.id) === value ? 'dropdown-option-selected' : ''}`}
                    onClick={() => handleSelect(uni)}
                    role="option"
                    aria-selected={String(uni.id) === value}
                  >
                    {uni.name}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        className="dropdown-hidden-select"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{placeholder}</option>
        {universities.map((uni) => (
          <option key={uni.id} value={uni.id}>
            {uni.name}
          </option>
        ))}
      </select>

      {hasError && <span className="error-message">{error}</span>}
    </div>
  );
};
