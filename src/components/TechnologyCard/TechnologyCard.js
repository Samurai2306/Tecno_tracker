import React from 'react';
import { Link } from 'react-router-dom';
import './TechnologyCard.css';
import TechnologyNotes from '../TechnologyNotes/TechnologyNotes';

const TechnologyCard = ({ technology, onStatusChange, onNotesChange, showNotes = false, linkTo }) => {
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

  const handleClick = (e) => {
    // Не меняем статус при клике на textarea или на ссылку
    if (e.target.tagName !== 'TEXTAREA' && 
        e.target.tagName !== 'A' && 
        !e.target.closest('a') &&
        onStatusChange) {
      const statusOrder = ['not-started', 'in-progress', 'completed'];
      const currentIndex = statusOrder.indexOf(technology.status);
      const nextIndex = (currentIndex + 1) % statusOrder.length;
      onStatusChange(technology.id, statusOrder[nextIndex]);
    }
  };

  const cardContent = (
    <div
      className={`technology-card technology-card--${technology.status}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${technology.title}, статус: ${getStatusLabel(technology.status)}, категория: ${technology.category || 'не указана'}`}
    >
      <div className="technology-card__header">
        <div style={{ flex: 1 }}>
          {technology.category && (
            <span className="technology-card__category">{technology.category}</span>
          )}
          <h3 className="technology-card__title">{technology.title}</h3>
        </div>
        <span className="technology-card__status-icon">
          {getStatusIcon(technology.status)}
        </span>
      </div>
      <p className="technology-card__description">{technology.description}</p>
      {showNotes && (
        <TechnologyNotes
          technology={technology}
          onNotesChange={onNotesChange}
        />
      )}
      <div className="technology-card__footer">
        <span className="technology-card__status-label">
          {getStatusLabel(technology.status)}
        </span>
        {linkTo && (
          <Link 
            to={linkTo} 
            className="technology-card__link"
            onClick={(e) => e.stopPropagation()}
          >
            Подробнее
          </Link>
        )}
      </div>
    </div>
  );

  return cardContent;
};

export default TechnologyCard;

