import React from 'react';
import './StatusFilter.css';

const StatusFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'all', label: 'Все' },
    { value: 'not-started', label: 'Не начатые' },
    { value: 'in-progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершенные' }
  ];

  return (
    <div className="status-filter">
      <h3 className="status-filter__title">Фильтр по статусу</h3>
      <div className="status-filter__buttons">
        {filters.map(filter => (
          <button
            key={filter.value}
            className={`status-filter__button ${
              currentFilter === filter.value
                ? 'status-filter__button--active'
                : ''
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;

