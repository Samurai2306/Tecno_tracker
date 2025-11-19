import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ searchQuery, onSearchChange, resultsCount }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    onSearchChange(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <input
          type="text"
          className="search-bar__input"
          placeholder="Поиск по названию и описанию..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <span className="search-bar__icon">🔍</span>
      </div>
      {debouncedQuery && (
        <div className="search-bar__results">
          Найдено результатов: {resultsCount}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

