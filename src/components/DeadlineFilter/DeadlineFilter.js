import React from 'react';
import './DeadlineFilter.css';

const DeadlineFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'Все', icon: '📋' },
    { value: 'with-deadline', label: 'С дедлайном', icon: '📅' },
    { value: 'urgent', label: 'Срочные', icon: '⏰' },
    { value: 'overdue', label: 'Просроченные', icon: '⚠️' },
    { value: 'no-deadline', label: 'Без дедлайна', icon: '∞' }
  ];

  return (
    <div className="deadline-filter">
      <h3 className="deadline-filter__title">Фильтр по дедлайнам</h3>
      <div className="deadline-filter__buttons">
        {filters.map(filter => (
          <button
            key={filter.value}
            className={`deadline-filter__button ${
              currentFilter === filter.value
                ? 'deadline-filter__button--active'
                : ''
            }`}
            onClick={() => onFilterChange(filter.value)}
            aria-label={filter.label}
          >
            <span className="deadline-filter__icon">{filter.icon}</span>
            <span className="deadline-filter__label">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeadlineFilter;

