import React from 'react';
import './QuickActions.css';

const QuickActions = ({
  onMarkAllCompleted,
  onResetAll,
  onRandomSelect,
  onExport
}) => {
  return (
    <div className="quick-actions">
      <h3 className="quick-actions__title">Быстрые действия</h3>
      <div className="quick-actions__buttons">
        <button
          className="quick-actions__button quick-actions__button--complete"
          onClick={onMarkAllCompleted}
        >
          Отметить все как выполненные
        </button>
        <button
          className="quick-actions__button quick-actions__button--reset"
          onClick={onResetAll}
        >
          Сбросить все статусы
        </button>
        <button
          className="quick-actions__button quick-actions__button--random"
          onClick={onRandomSelect}
        >
          Случайный выбор следующей технологии
        </button>
        <button
          className="quick-actions__button quick-actions__button--export"
          onClick={onExport}
        >
          Экспорт данных
        </button>
      </div>
    </div>
  );
};

export default QuickActions;

