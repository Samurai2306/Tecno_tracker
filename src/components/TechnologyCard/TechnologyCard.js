import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TechnologyCard.css';
import TechnologyNotes from '../TechnologyNotes/TechnologyNotes';
import { formatTimeUntilDeadline, getDeadlineUrgency, getUrgencyColorClass } from '../../utils/deadlineUtils';

const TechnologyCard = ({ technology, onStatusChange, onNotesChange, showNotes = false, linkTo }) => {
  const [timeUntilDeadline, setTimeUntilDeadline] = useState(null);
  const [deadlineUrgency, setDeadlineUrgency] = useState('normal');

  // Обновляем время до дедлайна каждую минуту
  useEffect(() => {
    if (technology.deadline) {
      const updateTime = () => {
        const formatted = formatTimeUntilDeadline(technology.deadline);
        const urgency = getDeadlineUrgency(technology.deadline);
        setTimeUntilDeadline(formatted);
        setDeadlineUrgency(urgency);
      };

      updateTime();
      const interval = setInterval(updateTime, 60000); // Обновляем каждую минуту

      return () => clearInterval(interval);
    } else {
      setTimeUntilDeadline(null);
      setDeadlineUrgency('normal');
    }
  }, [technology.deadline]);
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
      
      {technology.deadline && timeUntilDeadline && (
        <div className={`technology-card__deadline ${getUrgencyColorClass(deadlineUrgency)}`}>
          <span className="technology-card__deadline-icon">
            {deadlineUrgency === 'overdue' ? '⚠️' : deadlineUrgency === 'urgent' ? '⏰' : '📅'}
          </span>
          <span className="technology-card__deadline-text">
            {timeUntilDeadline}
          </span>
        </div>
      )}

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

