import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../../components/TechnologyCard/TechnologyCard';
import StatusFilter from '../../components/StatusFilter/StatusFilter';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import SearchBar from '../../components/SearchBar/SearchBar';
import BulkStatusEditor from '../../components/BulkStatusEditor/BulkStatusEditor';
import { useTechnologies } from '../../hooks/useTechnologies';
import './TechnologyList.css';

const TechnologyList = ({ userId }) => {
  const { technologies, updateStatus, updateNotes } = useTechnologies(userId);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkEditor, setShowBulkEditor] = useState(false);

  // Фильтрация по категории
  let filteredTechnologies = categoryFilter === 'all'
    ? technologies
    : technologies.filter(t => t.category === categoryFilter);

  // Фильтрация по статусу
  if (statusFilter !== 'all') {
    filteredTechnologies = filteredTechnologies.filter(t => t.status === statusFilter);
  }

  // Поиск по названию и описанию
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTechnologies = filteredTechnologies.filter(tech =>
      tech.title.toLowerCase().includes(query) ||
      tech.description.toLowerCase().includes(query) ||
      (tech.category && tech.category.toLowerCase().includes(query))
    );
  }

  return (
    <div className="technology-list">
      <div className="technology-list__header">
        <h2 className="technology-list__title">Список технологий</h2>
        <button
          className="technology-list__bulk-edit-button"
          onClick={() => setShowBulkEditor(true)}
          aria-label="Открыть массовое редактирование статусов"
        >
          Массовое редактирование
        </button>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultsCount={filteredTechnologies.length}
      />
      <CategoryFilter
        currentCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        technologies={technologies}
      />
      <StatusFilter
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      <div className="technology-list__grid">
        {filteredTechnologies.map(technology => (
          <TechnologyCard
            key={technology.id}
            technology={technology}
            onStatusChange={updateStatus}
            onNotesChange={updateNotes}
            showNotes={false}
            linkTo={`/technologies/${technology.id}`}
          />
        ))}
      </div>
      {filteredTechnologies.length === 0 && (
        <div className="technology-list__empty">
          <p>Технологии не найдены</p>
          <Link to="/add" className="technology-list__add-link">
            Добавить новую технологию
          </Link>
        </div>
      )}

      <BulkStatusEditor
        technologies={technologies}
        onUpdateStatuses={updateStatus}
        isOpen={showBulkEditor}
        onClose={() => setShowBulkEditor(false)}
      />
    </div>
  );
};

export default TechnologyList;

