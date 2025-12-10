import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../../components/TechnologyCard/TechnologyCard';
import StatusFilter from '../../components/StatusFilter/StatusFilter';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import DeadlineFilter from '../../components/DeadlineFilter/DeadlineFilter';
import SearchBar from '../../components/SearchBar/SearchBar';
import BulkStatusEditor from '../../components/BulkStatusEditor/BulkStatusEditor';
import { useTechnologies } from '../../hooks/useTechnologies';
import { getTimeUntilDeadline, getDeadlineUrgency } from '../../utils/deadlineUtils';
import './TechnologyList.css';

const TechnologyList = ({ userId }) => {
  const { technologies, updateStatus, updateNotes } = useTechnologies(userId);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkEditor, setShowBulkEditor] = useState(false);

  // Фильтрация и сортировка
  const filteredTechnologies = useMemo(() => {
    let filtered = [...technologies];

    // Фильтрация по категории
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Фильтрация по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Фильтрация по дедлайнам
    if (deadlineFilter === 'with-deadline') {
      filtered = filtered.filter(t => t.deadline);
    } else if (deadlineFilter === 'no-deadline') {
      filtered = filtered.filter(t => !t.deadline);
    } else if (deadlineFilter === 'urgent') {
      filtered = filtered.filter(t => {
        if (!t.deadline || t.status === 'completed') return false;
        const urgency = getDeadlineUrgency(t.deadline);
        return urgency === 'urgent' || urgency === 'overdue';
      });
    } else if (deadlineFilter === 'overdue') {
      filtered = filtered.filter(t => {
        if (!t.deadline || t.status === 'completed') return false;
        const timeInfo = getTimeUntilDeadline(t.deadline);
        return timeInfo && timeInfo.isOverdue;
      });
    }

    // Поиск по названию и описанию
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.title.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        (tech.category && tech.category.toLowerCase().includes(query))
      );
    }

    // Сортировка
    if (sortBy === 'deadline') {
      filtered.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        
        const aTime = getTimeUntilDeadline(a.deadline);
        const bTime = getTimeUntilDeadline(b.deadline);
        
        if (aTime.isOverdue && !bTime.isOverdue) return -1;
        if (!aTime.isOverdue && bTime.isOverdue) return 1;
        
        return (aTime.totalDays || Infinity) - (bTime.totalDays || Infinity);
      });
    } else if (sortBy === 'urgency') {
      filtered.sort((a, b) => {
        const aUrgency = a.deadline ? getDeadlineUrgency(a.deadline) : 'normal';
        const bUrgency = b.deadline ? getDeadlineUrgency(b.deadline) : 'normal';
        
        const urgencyOrder = { 'overdue': 0, 'urgent': 1, 'soon': 2, 'normal': 3 };
        return urgencyOrder[aUrgency] - urgencyOrder[bUrgency];
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [technologies, categoryFilter, statusFilter, deadlineFilter, searchQuery, sortBy]);

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
      <div className="technology-list__filters">
        <CategoryFilter
          currentCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          technologies={technologies}
        />
        <StatusFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
        <DeadlineFilter
          currentFilter={deadlineFilter}
          onFilterChange={setDeadlineFilter}
        />
      </div>
      
      <div className="technology-list__sort">
        <label htmlFor="sort-select" className="technology-list__sort-label">
          Сортировка:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="technology-list__sort-select"
          aria-label="Выберите способ сортировки"
        >
          <option value="default">По умолчанию</option>
          <option value="title">По названию</option>
          <option value="deadline">По дедлайну</option>
          <option value="urgency">По срочности</option>
        </select>
      </div>
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

