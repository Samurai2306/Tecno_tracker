import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import './BulkStatusEditor.css';

const BulkStatusEditor = ({ technologies, onUpdateStatuses, isOpen, onClose }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newStatus, setNewStatus] = useState('not-started');
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    search: ''
  });

  // Сброс выбора при открытии/закрытии модального окна
  useEffect(() => {
    if (isOpen) {
      setSelectedIds([]);
      setNewStatus('not-started');
    }
  }, [isOpen]);

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    if (filter.category !== 'all' && tech.category !== filter.category) {
      return false;
    }
    if (filter.status !== 'all' && tech.status !== filter.status) {
      return false;
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return tech.title.toLowerCase().includes(searchLower) ||
             tech.description.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTechnologies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTechnologies.map(tech => tech.id));
    }
  };

  const handleApplyStatus = () => {
    if (selectedIds.length === 0) {
      return;
    }
    
    // Применяем новый статус ко всем выбранным технологиям
    selectedIds.forEach(id => {
      onUpdateStatuses(id, newStatus);
    });
    
    // Показываем сообщение об успехе
    alert(`Статус "${getStatusLabel(newStatus)}" применен к ${selectedIds.length} технологи${selectedIds.length === 1 ? 'и' : selectedIds.length < 5 ? 'ям' : 'ям'}`);
    
    // Очищаем выбор и закрываем модальное окно
    setSelectedIds([]);
    onClose();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      case 'not-started':
        return 'Не начато';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '[V]';
      case 'in-progress':
        return '[~]';
      case 'not-started':
        return '[ ]';
      default:
        return '[ ]';
    }
  };

  const categories = [...new Set(technologies.map(t => t.category).filter(Boolean))];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bulk-status-editor" role="dialog" aria-labelledby="bulk-editor-title" aria-modal="true">
        <div className="bulk-status-editor__header">
          <h2 id="bulk-editor-title" className="bulk-status-editor__title">
            Массовое редактирование статусов
          </h2>
          <button
            className="bulk-status-editor__close"
            onClick={onClose}
            aria-label="Закрыть окно массового редактирования"
          >
            ×
          </button>
        </div>

        <div className="bulk-status-editor__filters">
          <div className="bulk-status-editor__filter-group">
            <label htmlFor="category-filter" className="bulk-status-editor__filter-label">
              Категория:
            </label>
            <select
              id="category-filter"
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="bulk-status-editor__filter-select"
              aria-label="Фильтр по категории"
            >
              <option value="all">Все категории</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="bulk-status-editor__filter-group">
            <label htmlFor="status-filter" className="bulk-status-editor__filter-label">
              Текущий статус:
            </label>
            <select
              id="status-filter"
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="bulk-status-editor__filter-select"
              aria-label="Фильтр по статусу"
            >
              <option value="all">Все статусы</option>
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
            </select>
          </div>

          <div className="bulk-status-editor__filter-group">
            <label htmlFor="search-filter" className="bulk-status-editor__filter-label">
              Поиск:
            </label>
            <input
              id="search-filter"
              type="text"
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="bulk-status-editor__filter-input"
              placeholder="Поиск по названию..."
              aria-label="Поиск технологий"
            />
          </div>
        </div>

        <div className="bulk-status-editor__selection-controls">
          <button
            type="button"
            onClick={handleSelectAll}
            className="bulk-status-editor__select-all"
            aria-label={selectedIds.length === filteredTechnologies.length ? "Снять выделение со всех" : "Выделить все"}
          >
            {selectedIds.length === filteredTechnologies.length ? 'Снять выделение' : 'Выделить все'}
          </button>
          <span className="bulk-status-editor__selection-count">
            Выбрано: {selectedIds.length} из {filteredTechnologies.length}
          </span>
        </div>

        <div 
          className="bulk-status-editor__list"
          role="listbox"
          aria-label="Список технологий для выбора"
          aria-multiselectable="true"
        >
          {filteredTechnologies.length === 0 ? (
            <div className="bulk-status-editor__empty" role="status" aria-live="polite">
              Технологии не найдены
            </div>
          ) : (
            filteredTechnologies.map(tech => {
              const isSelected = selectedIds.includes(tech.id);
              return (
                <div
                  key={tech.id}
                  className={`bulk-status-editor__item ${isSelected ? 'bulk-status-editor__item--selected' : ''}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleToggleSelect(tech.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggleSelect(tech.id);
                    }
                  }}
                  tabIndex={0}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(tech.id)}
                    className="bulk-status-editor__checkbox"
                    aria-label={`Выбрать ${tech.title}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="bulk-status-editor__item-content">
                    <div className="bulk-status-editor__item-header">
                      <span className="bulk-status-editor__item-title">{tech.title}</span>
                      <span className="bulk-status-editor__item-status-icon">
                        {getStatusIcon(tech.status)}
                      </span>
                    </div>
                    {tech.category && (
                      <span className="bulk-status-editor__item-category">{tech.category}</span>
                    )}
                    <span className="bulk-status-editor__item-status">
                      Текущий статус: {getStatusLabel(tech.status)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="bulk-status-editor__actions">
          <div className="bulk-status-editor__status-select">
            <label htmlFor="new-status" className="bulk-status-editor__status-label">
              Новый статус для выбранных:
            </label>
            <select
              id="new-status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="bulk-status-editor__status-select-input"
              aria-label="Выберите новый статус"
            >
              <option value="not-started">Не начато</option>
              <option value="in-progress">В процессе</option>
              <option value="completed">Завершено</option>
            </select>
          </div>
          <div className="bulk-status-editor__buttons">
            <button
              type="button"
              onClick={onClose}
              className="bulk-status-editor__button bulk-status-editor__button--cancel"
              aria-label="Отменить массовое редактирование"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleApplyStatus}
              disabled={selectedIds.length === 0}
              className="bulk-status-editor__button bulk-status-editor__button--apply"
              aria-label={`Применить статус "${getStatusLabel(newStatus)}" к ${selectedIds.length} выбранным технологиям`}
              aria-disabled={selectedIds.length === 0}
            >
              Применить к {selectedIds.length > 0 ? `${selectedIds.length} ` : ''}выбранным
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BulkStatusEditor;

